<template>
  <nicknameSetting @change="nicknameChange"></nicknameSetting>
  <avatarSetting @change="avatarChange"></avatarSetting>
</template>
<script setup>
import nicknameSetting from './nicknameSetting.vue';
import avatarSetting from './avatarSetting.vue';

const nicknameChange = (nickname) => {
  console.log('nicknameChange', nickname)
}
const avatarChange = (avatar) => {
  console.log('avatarChange', avatar)
}


</script>