const PORT = 8000
const { MongoClient, MONGO_CLIENT_EVENTS } = require('mongodb')
const express = require('express')
//generate a unique id for user
const { v4: uuidv4 } = require('uuid')
const jwt = require('jsonwebtoken')
const cors = require('cors')
const bcrypt = require('bcrypt')

const uri = 'mongodb+srv://dakshr264:dakshrajput.in@cluster0.utku7ad.mongodb.net/?retryWrites=true&w=majority'


const app = express()
app.use(cors())
app.use(express.json())

//root
app.get('/', (req, res) => {
    res.json('hello to my app')
})

app.post('/signup', async (req, res) => {
    const client = new MongoClient(uri)

    //data from frontend to backend
    const { email, password } = req.body

    const genrateduserId = uuidv4()
    //bcrypt library is used to hash our passowrd
    const hashedpassword = await bcrypt.hash(password, 10)

    try {
        await client.connect()
        const database = client.db('matcher-data')
        const users = database.collection('users')

        const existingUser = await users.findOne({ email })

        if (existingUser) {
            return res.status(409).send('User alreday exits. Please login')
        }

        const sanitizedemail = email.toLowerCase()

        const data = {
            user_id: genrateduserId,
            email: sanitizedemail,
            hashed_password: hashedpassword
        }
        const insertedUser = await users.insertOne(data)

        const token = jwt.sign(insertedUser, sanitizedemail, {
            expiresIn: 60 * 24,
        })

        res.status(201).json({ token, userId: genrateduserId })
    } catch (err) {
        console.log(err)
    }
})

app.post('/login', async (req, res) => {

    const client = new MongoClient(uri)
    const { email, password } = req.body

    try {
        await client.connect()
        const database = client.db('matcher-data')
        const users = database.collection('users')

        const user = await users.findOne({ email })
        const correctpasword = await bcrypt.compare(password, user.hashed_password)

        if (user && correctpasword) {
            const token = jwt.sign(user, email, {
                expiresIn: 60 * 24
            })
            res.status(201).send({ token, userId: user.user_id })
        }
        
        else
        res.status(400).send('Invalid Crendentials')
    } catch (err) {
        console.log(err)
    } finally {
        await client.close()
    }
})


app.get('/seek-user', async (req, res) => {
    const client = new MongoClient(uri)
    const seeked = req.query.seeked || 'both'
    console.log('seeked',seeked)

    try {
        await client.connect()
        const database = client.db('matcher-data')
        const users = database.collection('users')

        const query = { haveproject: seeked === 'both' ? { $in: ['YES', 'NO'] } : (seeked === 'project' ? 'YES' : 'NO')}
        console.log(query)
        const foundUsers = await users.find(query).toArray()
        //console.log(foundUsers)
        res.send(foundUsers)

    } finally {
        await client.close()
    }
})

app.get('/user', async (req, res) => {
    const client = new MongoClient(uri)
    const userId = req.query.userId

    try {
        await client.connect()
        const database = client.db('matcher-data')
        const users = database.collection('users')

        const query = { user_id: userId }
        const user = await users.findOne(query)
        //const foundUsers = await users.find(query).toArray()

        res.send(user)
    } finally {
        await client.close()
    }
})

app.get('/users', async (req, res) => {
    const client = new MongoClient(uri)
    const userIds = JSON.parse(req.query.userIds)

    try {
        await client.connect()
        const database = client.db('matcher-data')
        const users = database.collection('users')

        const pipeline =
            [
                {
                    '$match': {
                        'user_id': {
                            '$in': userIds
                        }
                    }
                }
            ]
        const foundUsers = await users.aggregate(pipeline).toArray()
        res.send(foundUsers)
    } finally {
        await client.close()
    }
})

app.put('/addmatch', async (req, res) => {

    const client = new MongoClient(uri)
    const { userId, matchedUserId } = req.body

    try {
        await client.connect()
        const database = client.db('matcher-data')
        const users = database.collection('users')

        const query = { user_id: userId }
        const updateDocument = {
            $push: { matches: { user_id: matchedUserId } },
        }
        const user = await users.updateOne(query, updateDocument)
        res.send(user)
    } finally {
        await client.close()
    }
})

app.get('/messages', async (req, res) => {

    const client = new MongoClient(uri)
    const { userId, correspondingUserId } = req.query

    try {
        await client.connect()
        const database = client.db('matcher-data')
        const messages = database.collection('messages')

        const query = {
            from_userId: userId,
            to_userId: correspondingUserId
        }
        const foundMessages = await messages.find(query).toArray()
        res.send(foundMessages)
    } finally {
        await client.close()
    }
})

app.post('/message', async(req,res)=> {
    const client = new MongoClient(uri)
    const message = req.body.message 

    try{
        await client.connect()
        const database = client.db('matcher-data')
        const messages = database.collection('messages')

        const insertedMessage = await messages.insertOne(message)
        res.send(insertedMessage)
    } finally {
        await client.close()
    }
})

app.put('/user', async (req, res) => {
    const client = new MongoClient(uri)
    const formData = req.body.formData

    try {
        await client.connect()
        const database = client.db('matcher-data')
        const users = database.collection('users')

        const query = { user_id: formData.user_id }

        const updateDocument = {
            $set: {
                first_name: formData.first_name,
                dob_day: formData.dob_day,
                dob_month: formData.dob_month,
                dob_year: formData.dob_year,
                haveproject: formData.haveproject,
                seek: formData.seek,
                url: formData.url,
                matches: formData.matches,
                skills: formData.skills,
                projectName: formData.projectName,              
                projectDescription: formData.projectDescription,
                skillRequired: formData.skillRequired,
                interests: formData.interests
            },
        }
        const insertedUser = await users.updateOne(query, updateDocument, { upsert: true })
        res.send(insertedUser)
    } finally {
        await client.close()
    }
})
app.listen(PORT, () => console.log('Server running on PORT' + PORT))