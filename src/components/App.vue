<template>

    <div class="content">
        <header>
            <h1><router-link to="/">Brigade Project Index</router-link></h1>
            <h2>STATUSBOARD</h2>
            <div class="loader" v-if="loading">
                <div class="spinner-border" role="status">
                    <span class="sr-only">loading...</span>
                </div>
                Loading {{ loading }}
            </div>
        </header>
        <router-view></router-view>
        <div class="leader-link">
            <router-link class="btn btn-primary" to="/">Map</router-link>
            <router-link class="btn btn-primary" to="/leaders">Brigades</router-link>
            <router-link class="btn btn-primary" to="/topics">Topics</router-link>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            last_check: null,
        };
    },
    computed: {
        loading(){
            return this.$store.getters.loading;
        }
    },
    created(){
        this.last_check = new Date();
        this.$store.dispatch("load_all");
        window.setInterval(this.checkForUpdates, 30000); // Check for updates every minute
    },
    methods: {
        checkForUpdates() {
            this.$store.dispatch("check_for_updates", this.last_check);
            this.last_check = new Date();
        }
    }
}
</script>

<style>
    header {
        position: absolute;
        top: 10px;
        width: 100%;
        text-align: center;
    } 
    .leader-link {
        position: fixed;
        left: 8px;
        bottom: 8px;
    }
</style>