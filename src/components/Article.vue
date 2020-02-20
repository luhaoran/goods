<template>
  <div class="userWrap">
    <Navbar v-if="article.title" :name="bindSubstr(article.title)" />
    <div class="article">
      <h2 class="title">{{article.title}}</h2>
      <span class="time">{{article.time}}</span>
      <div class="content" v-html="article.content"></div>
    </div>
    <div class="icon" @click="$router.go(-1)">
      <i class="iconfont icon-zhuye"></i>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Navbar from "./Navbar";
export default {
  name: "Eachorder",
  components: {
    Navbar
  },
  data() {
    return {
      article: {}
    };
  },
  created() {
    const id = this.$route.query.id;
    this.getArticle(id);
  },
  mounted() {},

  methods: {
    getArticle(id) {
      this.$axios.get(`/getArticle?id=${id}`).then(({ data }) => {
        if (data.arr.title) {
          let article = data.arr;
          if (article.content)
            article.content = this.formatContent(article.content);
          this.article = data.arr;
        }
      });
    },
    bindSubstr(str) {
      return str.substr(0, 10);
    },
    formatContent(content) {
      if (content.indexOf(this.domain) < 0) {
        content = content.replace(/\/Public/gi, this.domain + "/Public");
      }
      return content;
    }
  },
  computed: {
    ...mapState(["user", "domain"])
  },
  watch: {}
};
</script>

<style lang="less" scope>
.article {
  padding: 15px;
}
.title {
  font-size: 23px;
  font-weight: normal;
  margin: 10px 0;
}
.time {
  font-size: 12px;
  color: #999;
  margin: 10px 0;
  display: block;
}
.content {
  color: #333;
  line-height: 22px;
}
.icon {
  position: fixed;
  bottom: 70px;
  right: 25px;
  width: 40px;
  height: 40px;
  background: #fff;
  border-radius: 100%;
  text-align: center;
  box-shadow: 0 0 15px #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  i{
    font-size: 24px;
    color: #f69e2a
  }
}
</style>
