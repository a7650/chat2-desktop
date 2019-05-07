<template>
  <transition name="home">
    <slot></slot>
  </transition>
</template>

<script>
export default {};
</script>

<style>
.home-enter,
.home-leave-to {
  transform: scale(0.7);
  opacity: 0;
}
.home-enter-active {
  transition:all .3s ease-out .3s;
}
.home-leave-active{
    transition: 0.3s;
}
</style>