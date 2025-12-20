
const express = require("express");
const bodyParser = require("body-parser")
const ejs = require("ejs")
const mongoose = require("mongoose");
const { drop } = require("lodash");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://sparky:63435582@cluster0.deiyrlp.mongodb.net/airdroptrackerDB")

const dropSchema = {
    name: String,
    description: String,
    link: String
}

const dropItem = mongoose.model("dropItem", dropSchema);

const defaultItems = [
    {
        name: "Arbitrum", 
        description: "Ethereum L2 project", 
        link: "google.com" 
    }
]

app.get("/", function(req, res){
    dropItem.find()
    .then((dropItems)=> {
        if (dropItems.length === 0) {
           return dropItem.insertMany(defaultItems);
            
        }
        return dropItems; 
    })
    .then((dropItems) => {
        res.render("home", {dropItems: dropItems});

    })
    .catch((err)=> {
        console.log(err)
    })
})

app.get("/compose", function(req, res){
    res.render("compose");
})

app.post("/compose", function(req, res){
    
    const dropTitle = req.body.dropTitle;
    const dropDescription = req.body.dropDescription;
    const dropLink = req.body.dropLink;
    
    const newDrop = new dropItem ({
        name: dropTitle,
        description: dropDescription,
        link: dropLink   
    })
    
    
    newDrop.save()
    .then(()=> {
        console.log("Drop Item added successfully");
        res.redirect("/")
    })
    .catch((err) => {
        console.log(err)
    })

});

app.post("/delete", (req, res) => {
    const deleteID = req.body.delete
    dropItem.deleteOne({_id: deleteID})
    .then(()=> {
        console.log(deleteID + " Drop Deleted Successfully")
        res.redirect("/")
    })
    .catch((err)=>{
        console.log(err)
    })
})



app.listen(process.env.PORT || 3000, function (){
    console.log("Server is up and running in port 3000")
})