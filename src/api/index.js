import {get, post} from "./http";

// 判断管理员是否登录成功
export const getLoginStatus = (params) => post(`admin/login/status`, params);

// ================= 歌手相关 ==========
// 查询所有歌手
export const getAllSinger = () => post('singer/selectAll');

// 添加歌手
export const setSinger = (params) => post('singer/insert', params);

// 修改歌手
export const updateSinger = (params) => post('singer/update', params);

// 删除歌手
export const deleteSinger = (id) => post('singer/delete', id);

// ================= 歌曲相关 ==========
// 根据歌手id查询歌曲列表
export const selectById = (singerId) => post('song/selectBySingerId', singerId);

// 编辑歌曲
export const updateSong = (params) => post('song/updateSong', params);

// 删除歌曲
export const deleteSong = (id) => post('song/deleteSong', id);

// 根据歌曲id查询歌曲对象
export const selectBySongId = (id) => post('song/selectById', id);

// 根据歌曲名获取歌曲对象
export const selectBySongName = (songName) => post('song/selectByName', songName);

// 查询所有歌曲
export const getAllSong = () => post('song/selectAll');

// ================= 歌单相关 ==========
// 查询所有歌单
export const getAllSongList = () => post('songList/selectAll');

// 添加歌单
export const setSongList = (params) => post('songList/insert', params);

// 修改歌单
export const updateSongList = (params) => post('songList/update', params);

// 删除歌单
export const deleteSongList = (id) => post('songList/delete', id);


// ================= 歌单的歌曲相关 ==========
// 根据歌单id查询歌曲列表
export const selectBySongListId = (songListId) => post('listSong/selectBySongListId', songListId);

// 添加歌单歌曲
export const listSongAdd = (params) => post('listSong/insert', params);

// 删除歌单的歌曲
export const deleteListSong = (params) => post('listSong/delete', params);

// ================= 用户相关 ==========
// 查询所有用户
export const getAllConsumer = () => post('consumer/selectAll');

// 添加歌用户
export const setConsumer = (params) => post('consumer/insert', params);

// 修改用户
export const updateConsumer = (params) => post('consumer/update', params);

// 删除用户
export const deleteConsumer = (id) => post('consumer/delete', id);