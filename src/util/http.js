import axios from 'axios';
import qs from 'qs'
import Cookies from 'js-cookie';
let warningNum = 0;
axios.defaults.timeout = 10000;
// axios.defaults.baseURL ='http://care.viewhighcloud.cn:8080/carebussinessweb/';//梁春雷电脑
axios.defaults.baseURL = 'https://care.viewhighcloud.cn/carebussinessweb/';//测试服务器
// axios.defaults.baseURL ='https://manager.51care.com/carebussinessweb/';//正式服务器
export function post(url, data = {}) {
	let sessionAdminHospitalid = window.sessionStorage.getItem('adminHospitalid');
	let sessionToken = window.sessionStorage.getItem('sessionToken');
	if (this.$route.name != 'login' && !sessionAdminHospitalid) {
		warningNum++;
		this.$message({
			content: '登录信息已过期,正在跳转至登录界面',
			duration: 3
		});
		this.$store.commit('logout');
		setTimeout(() => {
			warningNum = 0;
			this.$router.push({
				name: 'login'
			});
		}, 3000);
		return false;
	}
	return new Promise((resolve, reject) => {
		axios({
			method: "post",
			url: url,
			params: data,
			headers: { "token": sessionToken }
		}).then(res => {
			if (res.data.resultcode == 1 || res.data.result == 1) {
				warningNum = 0;
				resolve(res.data);
				this.$Loading.finish();
			} else {
				TiemOut();
				if (warningNum == 0) {
					warningNum++;
					this.$Loading.error();
					if (!res.data.errorcode) {
						this.$message('服务器连接失败，请检查网络');
						resolve(404);//返回错误信息
						return false;
					} else {
						switch (res.data.errorcode) {
							case '100000':
								this.$message({
									content: '系统错误',
									duration: 3
								});
								break;
							case '110000':
								this.$message({
									content: '数据库错误',
									duration: 3
								});
								break;
							case '100001':
								this.$message({
									content: '用户名不存在',
									duration: 3
								});
								break;
							case '100002':
								this.$message({
									content: '密码错误',
									duration: 3
								});
								break;
							case '100003':
								this.$message({
									content: '用户名或密码错误',
									duration: 3
								});
								break;
							case '100004':
								this.$message({
									content: '验证码过期',
									duration: 3
								});
								break;
							case '100005':
								this.$message({
									content: '验证码错误',
									duration: 3
								});
								break;
							case '100006':
								this.$message({
									content: '手机号码未注册',
									duration: 3
								});
								break;
							case '100007':
								this.$message({
									content: '手机号码重复',
									duration: 3
								});
								break;
							case '100008':
								this.$message({
									content: '验证码发送错误',
									duration: 3
								});
								break;
							case '100009':
								this.$message({
									content: '身份证号码重复',
									duration: 3
								});
								break;
							case '100010':
								this.$message({
									content: '用户不存在',
									duration: 3
								});
								break;
							case '100011':
								this.$message({
									content: '不是签约医院',
									duration: 3
								});
								break;
							case '100012':
								this.$message({
									content: '预约时间被占用',
									duration: 3
								});
								break;
							case '100013':
								this.$message({
									content: '医院名称已经存在',
									duration: 3
								});
								break;
							case '100014':
								this.$message({
									content: '科室已经存在',
									duration: 3
								});
								break;
							case '100015':
								this.$message({
									content: '参数中有空值',
									duration: 3
								});
								break;
							case '100016':
								this.$message({
									content: '微服务不可用',
									duration: 3
								});
								break;
							case '100017':
								this.$message({
									content: '微服务请求路径错误',
									duration: 3
								});
								break;
							case '100023':
								this.$message({
									content: '登录名已被占用，请使用其他用户名',
									duration: 3
								});
								break;
							case '100024':
								this.$message({
									content: '获取用户信息失败',
									duration: 3
								});
								break;
							case '100026':
								this.$message({
									content: '原密码错误',
									duration: 3
								});
								break;
							case '100029':
								this.$message({
									content: '身份验证失败，正在跳转至登录界面...',
									duration: 3
								});
								setTimeout(() => {
									warningNum = 0;
									this.$router.push({
										name: 'login'
									});
								}, 3000);
								this.$store.commit('logout');
								break;
							case '100030':
								this.$message({
									content: '您的账号在其他位置登录，如非本人操作请及时修改密码',
									duration: 3
								});
								setTimeout(() => {
									warningNum = 0;
									this.$router.push({
										name: 'login'
									});
								}, 3000);
								this.$store.commit('logout');
								break;
							case '100031':
								this.$message({
									content: '登录信息已过期,正在跳转至登录界面...',
									duration: 3
								});
								setTimeout(() => {
									warningNum = 0;
									this.$router.push({
										name: 'login'
									});
								}, 3000);
								this.$store.commit('logout');
								break;
						}
					}
					resolve(404);//返回错误信息
					return false;
				}
			}
		}).catch(err => {
			if (err.response.status == 401) {
				if (err.response.data.errorcode == '100030') {
					this.$message({
						content: '您的账号在其他位置登录，如非本人操作请及时修改密码',
						duration: 3
					});
					setTimeout(() => {
						warningNum = 0;
						this.$router.push({
							name: 'login'
						});
					}, 3000);
					this.$store.commit('logout');
				} else if (err.response.data.errorcode == '100031') {
					this.$message({
						content: '登录信息已过期,正在跳转至登录界面...',
						duration: 3
					});
					setTimeout(() => {
						warningNum = 0;
						this.$router.push({
							name: 'login'
						});
					}, 3000);
					this.$store.commit('logout');
				}
			} else if (warningNum == 0 && err.response.status != 401) {
				warningNum++;
				this.$Loading.error();
				if (err.message.indexOf('timeout') != -1) {   // 超时error捕获
					this.$message({
						content: '请求超时，请稍后重试！',
						duration: 3
					});
				} else {
					this.$message({
						content: '服务器请求失败，请稍后重试！',
						duration: 3
					});
				}
				TiemOut();
			}
			resolve(404);//返回错误信息
			return false;
		});
	})
}

export function postNoToken(url, data = {}) {
	return new Promise((resolve, reject) => {
		axios({
			method: "post",
			url: url,
			data: qs.stringify(data),
			//headers: { "Content-Type": "application/json;charset=UTF-8" }
		}).then(res => {
			if (res.data.resultcode == 1 || res.data.result == 1) {
				warningNum = 0;
				resolve(res.data);
				this.$Loading.finish();
			} else {
				if (warningNum == 0) {
					warningNum++;
					this.$Loading.error();
					if (!res.data.errorcode) {
						this.$message({
							content: '请求失败，请稍后重试',
							duration: 3
						});
						resolve(404);//返回错误信息
						return false;
					} else {
						TiemOut();
						switch (res.data.errorcode) {
							case '100000':
								this.$message({
									content: '系统错误',
									duration: 3
								});
								break;
							case '110000':
								this.$message({
									content: '数据库错误',
									duration: 3
								});
								break;
							case '100001':
								this.$message({
									content: '用户名不存在',
									duration: 3
								});
								break;
							case '100002':
								this.$message({
									content: '密码错误',
									duration: 3
								});
								break;
							case '100003':
								this.$message({
									content: '用户名或密码错误',
									duration: 3
								});
								break;
							case '100004':
								this.$message({
									content: '验证码过期',
									duration: 3
								});
								break;
							case '100005':
								this.$message({
									content: '验证码错误',
									duration: 3
								});
								break;
							case '100006':
								this.$message({
									content: '手机号码未注册',
									duration: 3
								});
								break;
							case '100007':
								this.$message({
									content: '手机号码重复',
									duration: 3
								});
								break;
							case '100008':
								this.$message({
									content: '验证码发送错误',
									duration: 3
								});
								break;
							case '100009':
								this.$message({
									content: '身份证号码重复',
									duration: 3
								});
								break;
							case '100010':
								this.$message({
									content: '用户不存在',
									duration: 3
								});
								break;
							case '100011':
								this.$message({
									content: '不是签约医院',
									duration: 3
								});
								break;
							case '100012':
								this.$message({
									content: '预约时间被占用',
									duration: 3
								});
								break;
							case '100013':
								this.$message({
									content: '医院名称已经存在',
									duration: 3
								});
								break;
							case '100014':
								this.$message({
									content: '科室已经存在',
									duration: 3
								});
								break;
							case '100015':
								this.$message({
									content: '参数中有空值',
									duration: 3
								});
								break;
							case '100016':
								this.$message({
									content: '微服务不可用',
									duration: 3
								});
								break;
							case '100017':
								this.$message({
									content: '微服务请求路径错误',
									duration: 3
								});
								break;
							case '100023':
								this.$message({
									content: '登录名已被占用，请使用其他用户名',
									duration: 3
								});
								break;
							case '100024':
								this.$message({
									content: '获取用户信息失败',
									duration: 3
								});
								break;
							case '100026':
								this.$message({
									content: '原密码错误',
									duration: 3
								});
								break;
							case '100029':
								this.$message({
									content: '身份验证失败，正在跳转至登录界面...',
									duration: 3
								});
								setTimeout(() => {
									warningNum = 0;
									this.$router.push({
										name: 'login'
									});
								}, 3000);
								this.$store.commit('logout');
								break;
							case '100030':
								this.$message({
									content: '您的账号在其他位置登录，如非本人操作请及时修改密码',
									duration: 3
								});
								setTimeout(() => {
									warningNum = 0;
									this.$router.push({
										name: 'login'
									});
								}, 3000);
								this.$store.commit('logout');
								break;
							case '100031':
								this.$message({
									content: '登录信息已过期,正在跳转至登录界面...',
									duration: 3
								});
								setTimeout(() => {
									warningNum = 0;
									this.$router.push({
										name: 'login'
									});
								}, 3000);
								this.$store.commit('logout');
								break;

						}
						resolve(404);//返回错误信息
						return false;
					}
				}
			}
		}).catch(err => {
			if (err.response.status == 401) {
				if (err.response.data.errorcode == '100030') {
					this.$message({
						content: '您的账号在其他位置登录，如非本人操作请及时修改密码',
						duration: 3
					});
					setTimeout(() => {
						warningNum = 0;
						this.$router.push({
							name: 'login'
						});
					}, 3000);
					this.$store.commit('logout');
				} else if (err.response.data.errorcode == '100031') {
					this.$message({
						content: '登录信息已过期,正在跳转至登录界面...',
						duration: 3
					});
					setTimeout(() => {
						warningNum = 0;
						this.$router.push({
							name: 'login'
						});
					}, 3000);
					this.$store.commit('logout');
				}
			} else if (warningNum == 0 && err.response.status != 401) {
				warningNum++;
				this.$Loading.error();
				if (err.message.indexOf('timeout') != -1) {   // 超时error捕获
					this.$message({
						content: '请求超时，请稍后重试！',
						duration: 3
					});
				} else {
					this.$message({
						content: '服务器请求失败，请稍后重试！',
						duration: 3
					});
				}
				TiemOut();
			}
			resolve(404);//返回错误信息
			return false;
		});
	})
}
function TiemOut() {
	setTimeout(() => {
		warningNum = 0;
	}, 0);
}
/**
 *
 * 案例
 *
 *let httpUrl = 'getDeptListByHospitalId';
 *let  httpParams = {
 *	hospitalId : this.hospitalMation.hospitalid
 *}
 *this.$post(httpUrl,httpParams).then(response => {
 *	this.departmentId = response.departmentList[0].children[0].deptid;
 *});
 *
 *
 *
 */