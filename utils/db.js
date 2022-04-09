module.exports = class Utils {
    static async getData(client, db, path) {
        let data;
        await db.ref(path)
            .once('value')
            .catch(e => client.utils.error(client, path, 'getData', e))
            .then(snapshot => {
                data = snapshot.val();
            });
        return data;
    }
    static setData(client, db, path, data) {
        db.ref(path)
            .set(data)
            .catch(e => client.utils.error(client, path, 'setData', e));
    }
    static removeData(client, db, path) {
        db.ref(path)
            .remove()
            .catch(e => client.utils.error(client, path, 'removeData', e));
    }
};
