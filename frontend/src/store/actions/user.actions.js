import { store } from '../store.js'

import { userService } from "../../services/user.service.js";
import { showErrorMsg } from '../../services/event-bus.service.js'

import { REMOVE_USER, SET_USER, SET_USERS, SET_WATCHED_USER } from "../reducers/user.reducer.js";
import { SET_BOARDS } from "../reducers/board.reducer.js";

export async function loadUsers() {
    try {
        const users = await userService.getUsers()
        store.dispatch({ type: SET_USERS, users })
        return users
    } catch (err) {
        console.error('UserActions: err in loadUsers', err)
    }
}

export async function removeUser(userId) {
    try {
        await userService.remove(userId)
        store.dispatch({ type: REMOVE_USER, userId })
    } catch (err) {
        console.error('UserActions: err in removeUser', err)
    }
}

export async function login(credentials) {
    try {
        const user = await userService.login(credentials)
        store.dispatch({
            type: SET_USER,
            user
        })
        return user
    } catch (err) {
        console.error('Cannot login', err)
        throw err
    }
}

export async function signup(credentials) {
    try {
        const user = await userService.signup(credentials)
        store.dispatch({
            type: SET_USER,
            user
        })
        return user
    } catch (err) {
        console.error('Cannot signup', err)
        throw err
    }
}

export async function logout() {
    try {
        await userService.logout()
        store.dispatch({
            type: SET_USER,
            user: null
        })
        store.dispatch({
            type: SET_BOARDS,
            boards: []
        })
    } catch (err) {
        console.error('Cannot logout', err)
        throw err
    }
}

export async function loadUser(userId) {
    try {
        const user = await userService.getById(userId);
        store.dispatch({ type: SET_WATCHED_USER, user })
    } catch (err) {
        showErrorMsg('Cannot load user')
        console.error('Cannot load user', err)
    }
}