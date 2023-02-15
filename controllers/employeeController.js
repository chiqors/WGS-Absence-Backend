const index = async(req, res) => {
    console.log('GET /employee');
    res.send('GET /employee');
};

const create = async(req, res) => {
    console.log('GET /employee/create');
    res.send('GET /employee/create');
};

const store = async(req, res) => {
    console.log('POST /employee');
    res.send('POST /employee');
}

const show = async(req, res) => {
    console.log('GET /employee/show/:id');
    res.send('GET /employee/show/:id');
}

const edit = async(req, res) => {
    console.log('GET /employee/edit/:id');
    res.send('GET /employee/edit/:id');
}

const update = async(req, res) => {
    console.log('PUT /employee/:id');
    res.send('PUT /employee/:id');
}

const destroy = async(req, res) => {
    console.log('DELETE /employee/:id');
    res.send('DELETE /employee/:id');
}

export default {
    index,
    create,
    store,
    show,
    edit,
    update,
    destroy
};