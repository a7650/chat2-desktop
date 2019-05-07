<template>
  <div class="book">
    <ul class="all-list">
      <li v-for="book in result" :key="book.id" @click="getBookDetail(book.id)">{{book.catalog}}</li>
    </ul>
    <div class="detail" v-if="detailShow">
      <header @click="detailShow=false">
        <i class="icon-false"></i>
        <div class="num">共{{current.length}}本</div>
      </header>
      <ul>
        <li v-for="item in current" :key="item.title">
          <a :href="item.online.split(/[\u4e00-\u9fa5]+/)[1].substring(1)" target="_blank">
            <span class="title">{{item.title}}</span>
            <br>
            <span class="sub">{{item.sub1}}</span>
            <br>
            <span class="time">{{item.bytime}}</span>
            <br>
            <span class="hot">{{item.reading}}</span>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      result:[
//    {
//      "id":"242",
//      "catalog":"中国文学"
//    },
//    {
//      "id":"243",
//      "catalog":"外国文学"
//    },
//    {
//      "id":"244",
//      "catalog":"儿童文学" 
//    },
//    {
//      "id":"245",
//      "catalog":"散文"
//    },
//    {
//      "id":"246",
//      "catalog":"经典名著"
//    },
//    {
//      "id":"247",
//      "catalog":"小说"
//    },
//    {
//      "id":"248",
//      "catalog":"历史"
//    },
//    {
//      "id":"249",
//      "catalog":"教育"
//    },
//   {
//      "id":"250",
//      "catalog":"成功励志"
//    },
//    {
//      "id":"251",
//      "catalog":"心灵鸡汤"
//    },
//    {
//      "id":"252",
//      "catalog":"人物传记"
//    },
//    {
//      "id":"253",
//      "catalog":"心理学"
//    },
//    {
//      "id":"254",
//      "catalog":"管理"
//    },
//    {
//      "id":"255",
//      "catalog":"经济"
//    },
//    {
//      "id":"256",
//      "catalog":"理财"
//    },
//    {
//      "id":"257",
//      "catalog":"哲学"
//    },
//    {
//      "id":"258",
//      "catalog":"计算机"
//    }
  ],
      current: {},
      detailShow: false
    };
  },
  methods: {
    getData() {
      this.$socket.emit("unified", "getBookData");
    },
    getBookDetail(id) {
      this.detailShow = true;
      this.$socket.emit("unified", "getBookDetail", { id });
    },
    c_getBookData(data) {
      this.current = data.result.data;
      //   let href = this.current[0].online
      //   let arr = href
      //   console.log(arr)
    },
    c_getData(data) {
      //   console.log(data)
      this.result = data.result;
    }
  },
  sockets: {
    c_unified_book(res) {
      let type = res[0];
      let data = res[1];
      this[type](data);
    }
  },
  created() {
    this.getData();
  }
};
</script>

<style  lang="less" scoped>
.book {
  max-height: 700px;
  overflow-y: scroll;
  width: 100%;
  border-radius: 10px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  margin-bottom: 20px;
  padding: 20px 0;
  position: relative;
  .all-list {
    li {
      width: 100%;
      text-align: center;
      padding: 5px 0;
      transition: 0.2s;
      color: #000;
    }
    li:hover {
      cursor: pointer;
      background-color: rgba(0, 0, 0, 0.1);
    }
  }
}
.detail {
  min-height: 700px;
  position: absolute;
  top: 0;
  width: 100%;
  background-color: #fff;
  header {
    height: 20px;
    line-height: 20px;
    text-align: center;
    padding-top: 10px;
    &:hover {
      cursor: pointer;
    }
    i {
        width: 10%;
      float: left;
      margin-left: 15px;
      display: block;
      width: 20px;
      height: 20px;
      color: #000;
      font-size: 18px;
      transition: 0.2s;
    }
    i:hover {
      color: #ff0000;
      transform: scale(1.4);
    }
    .num{
        width: 80%;
        float: left;
    }
  }
  li {
    margin: 20px 0;
    box-sizing: border-box;
    padding: 0 20px;
    .title {
      font-size: 22px;
      font-weight: bold;
      color: #000;
    }
    .sub,
    .time,
    .hot {
      color: #999;
      font-size: 14px;
      margin-top: 5px;
    }
    .sub {
    }
    .time {
      margin-right: 30px;
    }
    .hot {
    }
  }
}
</style>
