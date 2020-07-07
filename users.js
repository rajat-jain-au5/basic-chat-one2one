

const users = {};

exports.create = async (socket,newId) => {
      const id = await newId;
      users[id] = socket;
      return id;
};

exports.get = (id) => users[id];

exports.remove = (id) => delete users[id];