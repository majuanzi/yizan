<style lang="less">
  @import "../styles/menu.less";
</style>
<template>
  <Menu ref="sideMenu" :active-name="$route.name" :open-names="openNames" :theme="menuTheme" width="auto" z
    @on-select="changeMenu" accordion>
    <template v-for="(item,index) in menuList">
      <MenuItem v-if="item.children.length<=1" :name="item.children[0].name" :key="index">
      <!-- <Icon class="sidemenu-icon" :type="item.icon" :size="iconSize" :key="index"></Icon> -->
      <i class="icon iconfont" :class="[item.icon]" :key="index"></i>
      <span class="layout-text" :key="item.path">{{ itemTitle(item) }}</span>
      </MenuItem>
      <Submenu v-if="item.children.length > 1" :name="item.name" :key="item.path">
        <template slot="title">
          <!-- <Icon class="sidemenu-icon" :type="item.icon" :size="iconSize"></Icon> -->
          <i class="icon iconfont" :class="[item.icon]"></i>
          <span class="layout-text">{{ itemTitle(item) }}</span>
        </template>
        <template v-for="(child,index) in item.children">
          <MenuItem :name="child.name" :key="child.name">
          <Icon :type="child.icon" :size="iconSize" :key="index"></Icon>
          <span class="layout-text" :key="child.name">{{ child.title }}</span>
          </MenuItem>
        </template>
      </Submenu>
    </template>
  </Menu>
</template>

<script>
  export default {
    name: "sidebarMenu",
    props: {
      menuList: Array,
      iconSize: Number,
      menuTheme: {
        type: String,
        default: "light"
      },
      openNames: {
        type: Array
      }
    },
    methods: {
      changeMenu: function (active) {
        this.$emit("on-change", active);
      },
      itemTitle: function (item) {
        if (typeof item.title === "object") {
          return this.$t(item.title.i18n);
        } else {
          return item.title;
        }
      }
    },
    updated() {
      this.$nextTick(() => {
        if (this.$refs.sideMenu) {
          this.$refs.sideMenu.updateOpened();
          this.$refs.sideMenu.updateActiveName();
        }
      });
    }
  };
</script>