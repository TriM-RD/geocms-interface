<template>
    <div class="map-footer">
        <a href="https://campsabout.com" target="_blank">
            <img src="@/assets/img/logo.svg" alt="Campsabout Logo">
            <span>Made by Tri M d.o.o.</span>
        </a>
    </div>
</template>
  
<script lang="ts">
    import { Component, Vue } from "vue-facing-decorator";
    @Component
    export default class MapFooter extends Vue {}
</script>

<style scoped>
    .map-footer {
        position: absolute;
        bottom: 25px;
        right: 10px;
        background-color: rgba(4, 160, 74, 0.849);
        padding: 5px 10px;
        border-radius: 4px;
        font-size: 12px;
        z-index: 1000;
        display: flex;
        align-items: center;
    }
    .map-footer a {
        color: #fff;
        text-decoration: none;
        display: flex;
        align-items: center;
    }
    .map-footer img {
        height: 20px;
        margin-right: 5px;
    }
</style>