import express from "express";
import PromoCode from "../models/promocode.model.js";
import e from "express";
const promoCodeRouter = express.Router();


promoCodeRouter.post("/createPromoCode", async (req, res) => {    
    try{
        const newPromoCode =  await PromoCode.create(req.body); 
        res.json(newPromoCode);
        console.log({ message: "promoCode created successfully" });
    }
    catch(err){
        res.status(500).json({message: err.message});
        console.log('not created');
    } 
});

promoCodeRouter.get("/getPromoCodes", async (req, res) => {
    try{
        const promoCodes = await PromoCode.find();
        res.json(promoCodes);
    }
    catch(err){
        res.status(500).json({message: err.message});
    } 
});

promoCodeRouter.get("/getPromoCode/:id", async (req, res) => {
    try{
        const promoCode = await PromoCode.findById(req.params.id);
        if(promoCode){
            res.json(promoCode);
        }
        else{
            res.status(404).json({message: "promocode not found"});
        }
    }
    catch(err){ 
        res.status(500).json({message: err.message});
    } 
});

promoCodeRouter.delete("/deletePromoCode/:id", async (req, res) => {
    try{
        const promoCode = await PromoCode.findByIdAndDelete(req.params.id);
        if(promoCode){
            res.json({message: "promocode deleted successfully"});
        }
        else{
            res.status(404).json({message: "promocode not found"});
        }
    }
    catch(err){ 
        res.status(500).json({message: err.message});
    } 
});

export default promoCodeRouter;