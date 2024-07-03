const taskModel = require('../model/tasksModel')

exports.createTask = async (req, res) => {
    try{
        let postBody = req.body;
        let email = req.headers['email']
        postBody.email = email
        let task = await taskModel.create(postBody)
        res.status(201).json({status: 'success', message: 'A new task has been created', data: task})
    }catch(e){
        res.status(400).json({status: 'failed', data: e.toString()})
    }
}

exports.updateTask = async (req, res) => {
    try{

        let id = req.params.id
        let status = req.params.status
        let updateTask = await taskModel.updateOne({_id: id}, {status: status})
        res.status(201).json({status: 'success', data: updateTask})

    }catch(e){
        res.status(400).json({status: 'failed', data: e.toString()})
    }
}

exports.deleteTask = async (req, res) => {
    try{

        let id = req.params.id
        let deleteTask = await taskModel.deleteOne({_id: id})
        res.status(200).json({status: 'success', message: 'A task has been deleted', data: deleteTask})

    }catch(e){
        res.status(400).json({status: 'failed', data: e.toString()})
    }
}


exports.TaskListByStatus = async (req, res) => {
    try{
        let status = req.params.status
        let UserEmail = req.headers['email']

        let taskList = await taskModel.aggregate([
            {$match: {email: UserEmail, status:status}},
            {$project: {
                _id:1,
                title:1,
                description: 1,
                status: 1,
                createdDate: {
                    $dateToString: {
                        date: '$createdDate',
                        format: '%d-%m-%Y'
                    }
                }
            }}
        ])
        res.status(200).json({status: 'success', data: taskList})
    }catch(e){
        res.status(400).json({status: 'failed', data: e.toString()})
    }
}


exports.TaskStatusCount = async (req, res) => {
    try{

        let UserEmail = req.headers['email']
        
        let data = await taskModel.aggregate([
            {$match: {email: UserEmail}},
            {
                $group: {
                    _id: '$status',
                    sum: {$count: {}}
                }
            }
        ])

        res.status(200).json({status: 'success', data: data})
    }catch(e){
        res.status(400).json({status: 'failed', data: e.toString()})
    }
}