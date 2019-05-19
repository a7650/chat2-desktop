<template>
  <div class="weather">
    <div class="mes" v-if="temperature">
      <div class="text">
        <input v-model="otherCity" v-show="selectOther" placeholder="城市名称"><button v-show="selectOther" @click="otherWeather"><i class="icon-search"></i></button>
        <span v-show="!selectOther" class="city-name" title="点击切换城市" @click="selectOther=true">{{city}}</span>
        <span v-show="!selectOther">:{{text}} {{temperature}}℃</span>
      </div>
      <img
          class="icon"
          :src="weatherIcon"
          ondragstart="return false"
        >
    </div>
    <div class="loading" v-else>正在加载天气信息...</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      city: "",
      text:"",
      temperature:"",
      weatherIcon: "",
      otherCity: "",
      selectOther:false
    };
  },
  methods: {
    otherWeather() {
      this.selectOther = false;
      if(!this.otherCity){
        return
      }
      this.$socket.emit("unified", "getWeather", { location: encodeURIComponent(this.otherCity) });
    },
    getWeather() {
      this.$socket.emit("unified", "getWeather", {
        location: encodeURIComponent(this.city)
      });
    },
    c_getWeather(data) {
      if(data.error){
        window.alert(`查询不到"${this.otherCity}"的天气信息`);
        return
      }
      let now = data.results[0].now;
      this.city = data.results[0].location.name;
      this.text = now.text;
      this.temperature = now.temperature;
      this.weatherIcon = require(`./weatherIcon/${data.results[0].now.code}.png`);
      this.otherCity = "";;
    },
    getCity(data) {
      let self = this;
      let resFun = function(result) {
        self.city = result.name;
        self.weather = true;
        self.getWeather();
      };
      var myCity = new BMap.LocalCity();
      myCity.get(resFun);
    }
  },
  sockets: {
    c_unified_weather(res) {
      let type = res[0];
      let data = res[1];
      this[type](data);
    }
  },
  created() {
    this.getCity();
    // this.$socket.emit("unified", "getUserIP");
  }
};
</script>

<style  lang="less" scoped>
.weather {
  height: 70px;
  width: 100%;
  border-radius: 10px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  margin-bottom: 20px;
  overflow: hidden;
  .mes {
    width: 100%;
    height: 30px;
    padding-top: 20px;
    display: flex;
    justify-content: center;
  }
  .text {
    height: 100%;
    line-height: 30px;
    float: left;
    max-width: 200px;
    input{
      width: 100px;
      height: 100%;
      border-bottom: 3px solid #2298f0;
      box-sizing: border-box;
    }
    button{
      width: 30px;
      height: 30px;
      border-radius: 15px;
      border: none;
      background-color: #2298f0;
      color: #fff;
      font-size: 14px;
      font-weight: bold;
      transition: .2s;
      transition: .2s;
    }
    button:hover{
      box-shadow: 0 0 20px #2298f0;
      transform: scale(1.1);
    }
    .city-name {
      color: #999;
    }
    .city-name:hover {
      cursor: pointer;
      color: #000;
    }
  }
  .icon {
    float: left;
    width: 60px;
    height: 60px;
    margin-left: 20px;
    margin-top: -20px;
    transition: .5s;
  }
}
</style>
