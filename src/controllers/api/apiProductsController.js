const { response } = require('express');
const db = require('../../database/models');

const apiProductController = {
    getProducts(req, res){
        db.Product.findAll({include: {association: 'Category'}})
        .then(response => {
            res.status(200).json({
                count: response.length,
                countByCategory: response.reduce((array, product) => ({...array, [product.Category.category_name]: array[product.Category.category_name] += 1}), {Vinos: 0, Destilados: 0}),
                products: response.map(prod=> productsResponse(prod))
            })
        })

        .catch(error=> res.status(500).json('Error: Db_error' + error))
    },

    //detail va a aca
    detail (req, res) {
        db.Product.findByPk(req.params.id, {include: {association: 'Category'}})
        .then(response=>res.status(200).json(productsResponse(response)))
            .catch(error=> res.status(500).json('ERROR: DB_ERROR'+ error))
    },

    last (req, res) {
        db.Product.findOne ({
        order: [
            ['created_at', 'DESC']
        ]
        })
        .then (response => res.json(productsResponse(response)))
        .catch(error => res.json(error))
    },

    category: async (req, res)=>{
        try {
            let categorias = await db.Category.findAll()
            let rol = await db.Rol.findAll()
            res.json({
                categorias,
                rol
            })
        } catch (error) {
           res.json(error) 
        }
        
    },

    delete: async (req, res)=>{
        try {
            console.log('estoy aca');
            let {id} = req.params; 
            await db.Product.destroy({
                where: {
                    id
                }
            })
            
            res.status(200).json({
                status: 200,
                data: true
            });
        } catch (error) {
            console.log(error);
            res.json(error);
        }

    }
   
}
const productsResponse = (prod) => {
    const productsByUrl = {
        id: prod.id,
        name: prod.name,
        description: prod.description,
        price: prod.price,
        varietal_id: prod.varietal_id,
        year: prod.year,
        origen_id: prod.origen_id,
        region_id: prod.region_id,
        category_id: prod.category_id,
        image: `http://localhost:3008/img/product/${prod.image}`,
        brand_id: prod.brand_id
    }
    return productsByUrl
}

module.exports = apiProductController;
