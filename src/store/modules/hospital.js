const hospital = {
    state : {
        'deptid' : '',
        'hospitalname' : '',
        'hospitalid' : ''
    },
    mutations : {
        deptId(state,item){
            state.deptid = item;
        },
        hospitalName(state,item){
            state.hospitalname = item;
        },
        hospitalId(state,item){
            state.hospitalid = item;
        }
    },
    actions : {
        getDeptId(context,item){
            context.commit('deptId',item);
        },
        getHospitalName (context,item){
            context.commit('hospitalName',item);
        },
        getHosPitalId (context,item){
            context.commit('hospitalId',item);
        }
    }
}

export default hospital;