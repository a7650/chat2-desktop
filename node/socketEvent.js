const io = require('./main').io
const MDB = require('./MDBHandle')
const USERS = MDB.users
const axios = require('axios')
const PUBLIC_KEY = 'PwF7MjhPinObMUPus'
const PRIVATE_KEY = 'S2Taedkg4hGEiYH8y'
const BOOK_KEY = "3ce5a5d78aec8feb25365157eb311cd3"
var ONLINE = {}
var _ONLINE = {}

const events = {
    register(socket, { name, pas }) {
        USERS.get(name, user => {
            user.find().toArray((err, res) => {
                if (res.length) {
                    socket.emit('c_unified_login', 'c_register', { code: 0, mes: '账号已存在' })
                } else {
                    USERS.create(name, res => {
                        let initObj = [
                            { flag: 'config', name: name, password: pas, friends: [], vip: 0 },
                            { flag: 1, mes: { sys: [] } },
                            { flag: 2, unread: {}, system: [] }
                        ]
                        res.insertMany(initObj, err => {
                            if (err) {
                                throw new Error()
                            }
                        })
                        socket.emit('c_unified_login', 'c_register', { code: 1, mes: '注册成功' })
                    })
                }
            })
        })
    },
    login(socket, { name, pas }) {
        USERS.get(name, user => {
            user.find({ flag: 'config' }).toArray((err, res) => {
                let data = {}
                if (!res.length) {
                    data = { code: 0, mes: '账号不存在' }
                } else {
                    let config = res[0]
                    if (pas == config.password) {
                        data = { code: 1, data: config }
                        ONLINE[name] = socket.id
                        _ONLINE[socket.id] = name
                    } else {
                        data = { code: 0, mes: '密码错误' }
                    }
                }
                socket.emit('c_unified_login', 'c_login', data)
            })
        })
    },
    exit(socket, name) {
        let id = ONLINE[name]
        if (id) {
            delete ONLINE[name]
            delete _ONLINE[id]
        }
    },
    getUserIP(socket){
        socket.emit('c_unified_weather','c_getUserIP',socket.handshake.address)
    },
    getWeather(socket, { location }) {
        let url = `https://api.seniverse.com/v3/weather/now.json?key=${PRIVATE_KEY}&location=${location}&language=zh-Hans&unit=c`
        axios.get(url).then(res => {
            socket.emit('c_unified_weather', 'c_getWeather', res.data)
        }).catch(err=>{
            socket.emit('c_unified_weather', 'c_getWeather', {error:1})
        })
    },
    getSong(socket) {
        let data = {
            name: 'Photos Every Day',
            singer: 'Rob Simonsen',
            duration: 92,
            src: 'http://106.12.198.147/chatn/resource/PhotosEveryDay.mp3'
        }
        socket.emit('c_unified_getSong', 'c_getSong', data)
    },
    sendMessage(socket, data) {
        if (!(data && data.sendBy && data.sendTo)) {
            return
        }
        let sendBy = data.sendBy
        USERS.get(sendBy, (user, users) => {
            //user存入数据
            let userdata = Object.assign({}, data.message, { flag: true })
            let sendTo = data.sendTo
            if (!sendTo) { return }
            let o = {}
            o[`mes.${sendTo}`] = userdata
            user.updateOne({ flag: 1 }, {
                $push: o
            })
            //sendTo存入数据
            let id = ONLINE[sendTo]
            let to = users.collection(sendTo)
            if (id) {
                io.to(id).emit('c_unified_chat', 'receiveMessage', { sendBy, mes: data.message })
                let _o = {}
                _o[`mes.${sendBy}`] = data.message
                to.updateOne({ flag: 1 }, {
                    $push: _o
                })
            } else {
                let unread_mes = {}
                unread_mes[`unread.${sendBy}`] = data.message
                to.updateOne({ flag: 2 }, {
                    $push: unread_mes
                })
            }

        })
    },
    getUnread(socket, name) {
        USERS.get(name, user => {
            user.find({ flag: 2 }).toArray((err, res) => {
                if (err) {
                    console.log(err)
                } else {
                    let unread = res[0].unread
                    if (Object.keys(unread).length) {
                        socket.emit('c_unified_chat', 'c_getUnread', unread)
                    }
                }
            })
        })
    },
    hasRead(socket, { from, to }) {
        USERS.get(from, user => {
            let m = {}
            m[`unread.${to}`] = 1
            user.updateOne({ flag: 2 }, {
                $unset: m
            })
        })
    },
    addFriend1(socket, { from, to }) {
        USERS.get(to, user => {
            user.find().toArray((err, res) => {
                if (!res.length) {
                    socket.emit('c_unified_fs', 'c_addFriend1', { code: 0 })
                } else {
                    socket.emit('c_unified_fs', 'c_addFriend1', { code: 1 })
                }
            })
        })
    },
    addFriend2(socket, { from, to, mes }) {
        let id = ONLINE[to]
        let res = { sendBy: from, mes }
        USERS.get(to, user => {
            user.updateOne({ flag: 2 }, {
                $push: {
                    system: res
                }
            })
        })
        io.to(id).emit('c_unified_home', 'receiveSys', res)
    },
    getUnreadSys(socket, name) {
        USERS.get(name, user => {
            user.find({ flag: 2 }).toArray((err, res) => {
                if (res[0].system.length) {
                    socket.emit('c_unified_home', 'c_getUnreadSys', res[0].system)
                }
            })
        })
    },
    removeSys(socket, { from, to }) {
        USERS.get(from, user => {
            user.updateOne({ flag: 2 }, {
                $pull: {
                    system: { sendBy: to }
                }
            })
        })
    },
    agreeFriend(socket, { from, to }) {
        USERS.get(from, (user, users) => {
            user.updateOne({ flag: 'config' }, {
                $push: {
                    friends: to
                }
            })
            let other = users.collection(to)
            other.updateOne({ flag: 'config' }, {
                $push: {
                    friends: from
                }
            })
        })
        this.removeSys(undefined, { from, to })
        let id = ONLINE[to]
        if (id) {
            io.to(id).emit('c_unified_fs', 'refresh_fs', from)
        }
    },
    getBookData(socket){
        let url = `http://apis.juhe.cn/goodbook/catalog?key=${BOOK_KEY}&dtype=json`
        axios.get(url).then(res=>{
            socket.emit('c_unified_book', 'c_getData', res.data)
            // console.log(res)
        })
    },
    getBookDetail(socket,{id}){
        let url = `http://apis.juhe.cn/goodbook/query?key=${BOOK_KEY}&dtype=json&catalog_id=${id}`
        axios.get(url).then(res=>{
            socket.emit('c_unified_book', 'c_getBookData', res.data)
            // console.log(res)
        })
    }

}

function socketInit(socket) {
    socket.on('unified', (type, data) => {
        events[type](socket, data)
    })
    socket.on('disconnect', () => {
        let name = _ONLINE[socket.id]
        if (name) {
            delete ONLINE[name]
            delete _ONLINE[socket.id]
        }
    })
}

module.exports = socketInit