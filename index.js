const express = require('express')
const app = express()
const IncomingForm = require('formidable').IncomingForm
const jimp = require('jimp')
const fs = require('fs')

const path = require('path')

const port = process.env.PORT || 5000

const cors = require('cors')

app.use(cors({ // cors options
    origin: '*',
    optionsSuccessStatus: 200,
}))

app.use(express.static('client/build'))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html')); // send build
})

app.get("/images", (req, res) => {
    let uris = []
    let dir  = __dirname + "/upload/thumbnail/"
    try {
        let files = fs.readdirSync(dir)
        
        files.slice().reverse().forEach(file => {
            uris.push(file)
        })
    } catch {}

    res.json(uris)
})

app.get("/imgs/:type/:filename", (req, res) => {
    let path = __dirname + '/upload/'+ req.params.type + '/' + req.params.filename
    try {
        if (fs.existsSync(path))
            res.sendFile(path)
    } catch {
        console.log(path)
        res.status(404).send("file not found")
    }
    
})

app.post("/upload", function (req, res) {
    let form = new IncomingForm()

    var file_path, file_name

    form.on('fileBegin', (name, file) => {
        // process upload here. should be jPG / PNG, smallest edge should be 1200px, compress to 720px and 240px
        // save raw file
        let dt = new Date()
        file_name = dt.getTime() + '.' + file.name.split('.').pop()
        file_path = __dirname + '/upload/raw/' + file_name
        file.path = file_path
    })
    
    form.on('file', function (name, file) {

    })
    
    form.on('end', () => {
        
    })

    form.parse(req, (error, field, file) => {
        resizer(file_path, file_name, res)
    })
})

app.listen(port, () => {
    console.log("server running on port "+port)
})

const resizer = (file_path, file_name, res) => {
    jimp.read(file_path, (err, img) => {
        if (err) {
            // log error
            fs.appendFile(__dirname + '/upload/logs/error.log',
                'error reading file - ' + file_name + '\r\n', 
                error => console.log(error)
            )
        }

        if (img.getWidth() < img.getHeight()) {
            // compressed image
            try {
                img.resize(720, jimp.AUTO)
                    .quality(100)
                    .write(__dirname + '/upload/compressed/' + file_name)
                // thumbnail image
                img.resize(240, jimp.AUTO)
                    .quality(100)
                    .write(__dirname + '/upload/thumbnail/' + file_name)

                return res.json(file_name)
            } catch {
                fs.appendFile(__dirname + '/upload/logs/error.log', 
                    'error resizing width of - ' + file_name + '\r\n', 
                    error => console.log(error)
                )

                return res.json(false)
            }
        } else {
            // compressed image
            try {
                img.resize(jimp.AUTO, 720)
                    .quality(100)
                    .write(__dirname + '/upload/compressed/' + file_name)

            // thumbnail image
                img.resize(jimp.AUTO, 240)
                    .quality(100)
                    .write(__dirname + '/upload/thumbnail/' + file_name)
                return res.json(file_name)
            } catch {
                fs.appendFile(__dirname + '/upload/logs/error.log', 
                    'error resizing height of - ' + file_name + '\r\n', 
                    error => console.log(error)
                )

                return res.json(false)
            }
        }
    })
}

