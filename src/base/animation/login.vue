<template>
    <transition name="login">
        <slot></slot>
    </transition>
</template>

<script>
export default {

}
</script>

<style>
.login-enter,.login-leave-to{
    transform: scale(.8);
    opacity: 0
}
.login-leave-active,.login-enter-active{
    transition: .3s;
}

</style>