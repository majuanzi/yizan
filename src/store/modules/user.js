import Cookies from 'js-cookie';

const user = {
    state: {
        hospitalid : '',
        deptid : ''
    },
    mutations: {
        logout (state, vm) {
            sessionStorage.clear();
            localStorage.clear();
        },
        getters: function() {
            hospitalid: state => state.hospitalid  //获取messageList数据
        },
        setHospitalId (state,item){
            state.hospitalid = item;
        }
    },
    actions : {
        getHosPitalId(context,item){
            context.commit('setHospitalId',item);
        }
    }
};

export default user;
