import { Request, Response } from "express"
import { knex } from "../database/conn"
import { Car } from '../types'

export const listCars = async(_: Request, res: Response) => {
    try {
        const cars = await knex('carros');
        return res.json(cars);
    } catch {
        return res.status(500).json({mensagem: 'Erro interno do servidor.'})
    } 
}

export const detailCars = async(req: Request, res: Response) => {
    const { id } = req.params
    try {
        const car = await knex<Car>('carros').where({id: Number(id)}).first()

        if (!car) {
            return res.status(404).json({mensagem: 'Esse carro não foi encontrado.'})
        }

        return res.json(car)
    } catch {
        return res.status(500).json({mensagem: 'Erro interno do servidor.'})
    }
}

export const registerCars = async(req: Request, res: Response) => {
    const { marca, modelo, ano, cor, valor } = req.body

    try {
        const car = await knex<Omit<Car, 'id'>>('carros').insert({marca, modelo, cor, ano, valor}).returning("*")
        return res.status(201).json(car[0])
    } catch {
        return res.status(500).json({mensagem: 'Erro interno do servidor.'})
    }
}

export const updateCars = async(req: Request, res: Response) => {
    const { id } = req.params
    const { marca, modelo, cor, ano, valor} = req.body
    
    try {
        const car = await knex<Car>('carros').where({id: Number(id)}).first()

        if (!car) {
            return res.status(404).json({mensagem: 'Esse carro não foi encontrado.'})
        }

        await knex<Car>('carros').update({marca, modelo, cor, ano, valor}).where({id: Number(id)})

        return res.status(204).send()
    } catch {
        return res.status(500).json({mensagem: 'Erro interno do servidor.'})
    }
}

export const deleteCars = async(req: Request, res: Response) => {
    const { id } = req.params
    
    try {
        const car = await knex<Car>('carros').where({id: Number(id)}).first()

        if(!car) {
            return res.status(404).json({mensagem: 'O carro não foi encontrado.'})
        }
        
        await knex<Car>('carros').where({ id: Number(id) }).delete()

        return res.status(204).send()
    } catch {
        return res.status(500).json({mensagem: 'Erro interno do servidor.'})
    }
}