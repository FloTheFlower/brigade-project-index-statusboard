import axios from "axios";
import * as _ from "lodash";
import Vue from 'vue';
import Vuex from 'vuex'
import toml from 'toml';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        brigades: [],
        last_update: null,
        loading: "brigades",
    },
    getters: {
        brigades: state => {
            return state.brigades;
        },
        leaders: state => {
            const leaders = _.sortBy(state.brigades, b => -(b.tagged/b.projects.length));
            return _.slice(leaders,0,10);
        },
        topics: state => {
            const topics = [];
            state.brigades.forEach( br => {
                if(br.projects){
                    br.projects.forEach( prj => {
                        if(typeof prj.topics !== 'undefined') {
                            topics.push( ...prj.topics );
                        }
                    });
                }
            })
            return topics;
        },
        projects: state => {
            return _.flatten(_.map(state.brigades, b => b.projects));
        },
        loading: state => {
            return state.loading;
        },
    },
    mutations: {
        add_brigades( state, brigades ){
            state.brigades = brigades;
        },
        set_loading( state, value ){
            state.loading = value;
            state.last_update = new Date();
        }
    },
    actions: {
        load_all( {commit, dispatch} ){
            const url = `/api/data.json`;

            axios.get( url ).then( response => {
                const brigades = response.data;
                brigades.forEach( b => {
                    b.tagged = b.projects.filter( p => typeof p.topics !== 'undefined' && p.topics.length ).length;
                })
                //console.log("loaded brigades",brigades);
                commit('add_brigades', brigades);
                commit('set_loading',false);
            })
        },
       check_for_updates({commit, state, dispatch}, last_check) {
            console.log("TODO check for updates given last check was at ",last_check);
            dispatch("load_all");
        },
    },
});
