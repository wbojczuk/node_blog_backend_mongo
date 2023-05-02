const express = require("express");
const router = express.Router();
const path = require("path");
const { db } = require(path.join(__dirname,"db.js"));

const blogAPISettings = {
    returnLimit: 10,
    blogsAndDraftsReturnLimit: 50
}

async function updateTags(){
    const categories = await db.blogDatabase.collection("blog").aggregate([
        {
          $unwind: "$metadata.tags"
        },
        {
          $group: {
            _id: "null",
            categories: {
                "$addToSet": "$metadata.tags"
            }
          }
        }
      ]).toArray()
      
    await db.blogDatabase.collection("blog").updateOne({_id: "644bce6a18f200dd5d627da1"}, {$set: {allTags: categories[0].categories}}, {upsert: true});
    return true
}

router.route("/blogmetadata")
.get(async (req, res)=>{
    try{
        const result = await (db.blogDatabase.collection("blog")
        .find({"metadata.isDraft": false}, {projection: {metadata: 1}} )
        .limit(blogAPISettings.returnLimit)).toArray();
        res.json(result);
    }catch(err){
        console.error(err);
        res.sendStatus(500);
    }
    
});

router.route("/blogs")
.post(async (req, res)=>{
    
    if(req.user){
    
        const sentData = req.body;
        // Validate Properties Are there
        if(sentData.title && sentData.id && sentData.content && sentData.description, sentData.tags){


                const newBlog = {
                    _id: sentData.id,
                    metadata: {
                        isDraft: sentData.isdraft,
                        img: sentData.img,
                        title: sentData.title,
                        description: sentData.description,
                        tags: sentData.tags
                    },
                    content: `${sentData.content}`
                };
                
                await db.blogDatabase.collection("blog").updateOne({_id: sentData.id}, {$set: newBlog}, {upsert: true});

                // UPDATE ALL TAGS
                if(!sentData.isdraft){
                    await updateTags();
                }
                

                res.status = 200;
                res.send("Completed")
        
        }else{
            res.status = 406;
        }
    }else{
        res.json({"Error": "You need to be logged in to perform this action."})
        res.status = 406;
    }
});

// GET BLOG metadata and content BY ID
router.get("/blogbyid/:blogid", async (req,res)=>{
    const result = await db.blogDatabase.collection("blog").findOne({_id: req.params.blogid});
    if(result){
        res.json(result);
    }else{
        res.sendStatus(404);
    }
})

// GET LATEST 4 BLOGS
router.get("/latestblogs/:amount", async (req,res)=>{
    try{
        const result = await db.blogDatabase.collection("blog")
        .find({"metadata.isDraft": false}, {projection: {metadata: 1}})
        .sort({_id: 1})
        .limit(parseInt(req.params.amount)).toArray();

        res.json(result);
    }catch(err){
        res.sendStatus(500);
        console.error(err);
    }
});

router.get("/blogcategories", async (req,res)=>{

    try{
        const result = await db.blogDatabase.collection("blog").findOne({_id: "644bce6a18f200dd5d627da1"}, {projection: {_id: 0, allTags: 1}});
        res.json(result.allTags);
    }catch(err){
        console.error(err);
        res.sendStatus(500)
    }
})

// DELETE BLOG BY ID
router.delete("/deleteblog/:blogid", async (req, res)=>{
    if(req.user){
        try{
            await db.blogDatabase.collection("blog").deleteOne({_id: req.params.blogid});
            await updateTags();
            res.sendStatus(200);
        }catch(err){
            res.sendStatus(500);
            console.error(err);
        }
    
    }else{
        res.json({"Error": "You need to be logged in to perform this action."})
        res.status = 406;
    }
})

// ******************* END BLOGS API

router.get("/blogsanddrafts", (req, res)=>{
    try{
        const result = await (db.blogDatabase.collection("blog")
        .find({"metadata.isDraft": {$exists: true}}, {projection: {metadata: 1}} )
        .limit(blogAPISettings.blogsAndDraftsReturnLimit)).toArray();
        res.json(result);
    }catch(err){
        res.sendStatus(500);
        console.error(err);
    }
})

// ******************* START DRAFTS API

router.get("/drafts",async (req, res)=>{
        try{const result = await (db.blogDatabase.collection("blog")
            .find({"metadata.isDraft": true}, {projection: {metadata: 1}} )
            .limit(blogAPISettings.returnLimit)).toArray();
            res.json(result);
        }catch(err){
            res.sendStatus(500);
            console.error(err);
        }
})

module.exports = router;