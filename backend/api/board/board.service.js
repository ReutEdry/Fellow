import mongodb from 'mongodb'
const { ObjectId } = mongodb
import { dbService } from '../../services/db.service.js'
import { logger } from '../../services/logger.service.js'

export const boardService = {
    query,
    getById,
    remove,
    add,
    update,

}

async function query() {
    try {
        const collection = await dbService.getCollection('board')
        let boards = await collection.find('').toArray()
        return boards
    } catch (err) {
        logger.error('Cannot find boards', err);
        throw err;
    }
}

async function getById(boardId) {
    try {
        const collection = await dbService.getCollection('board')
        const board = collection.findOne({ _id: ObjectId(boardId) })
        return board
    } catch (err) {
        logger.error(`while finding board ${boardId}`, err)
        throw err
    }
}

async function remove(boardId) {
    try {
        const collection = await dbService.getCollection('board')
        await collection.deleteOne({ _id: ObjectId(boardId) })
    } catch (err) {
        logger.error(`cannot remove board ${boardId}`, err)
        throw err
    }
}

async function add(board) {
    try {
        const collection = await dbService.getCollection('board')
        await collection.insertOne(board)
        return board
    } catch (err) {
        logger.error('cannot insert board', err)
        throw err
    }
}

async function update(board) {
    try {
        const boardToSave = { ...board }
        delete boardToSave._id
        const collection = await dbService.getCollection('board')
        await collection.updateOne({ _id: ObjectId(board._id) }, { $set: boardToSave })
        return board
    } catch (err) {
        logger.error(`cannot update board ${board._id}`, err)
        throw err
    }
}




