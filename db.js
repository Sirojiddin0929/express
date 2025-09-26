let fs=require("fs").promises
let path=require("path")

let dbPath=path.join(__dirname,"books.json")

async function readBooks() {
    try{
        await fs.access(dbPath).catch(async ()=>{
            fs.writeFile(dbPath,JSON.stringify([]))
        })
        let data= await fs.readFile(dbPath,"utf8")
        return JSON.parse(data)

    }catch(err){
        throw new Error("Xullas xatolik o'qishda"+err.message)

    }
    
}
async function writeBooks(books) {
    try{
        await fs.writeFile(dbPath,JSON.stringify(books,null,2))

    }catch(err){
        throw new Error("Xullas xatolik yozishda"+err.message)

    }
    
}
module.exports={readBooks,writeBooks}