var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('192.241.168.84', 27017, {auto_reconnect: true});
db = new Db('bookdb', server, {w: 1});

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'bookdb'");
        db.collection('books', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'books' collection does not exist! Creating with sample data...");
                populateDB();
            }
        });
    }
});

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving book: ' + id);
    db.collection('books', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};

exports.findAll = function(req, res) {
    db.collection('books', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.addBook = function(req, res) {
    var book = req.body;
    console.log('Adding book: ' + JSON.stringify(book));
    db.collection('books', function(err, collection) {
        collection.insert(book, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error': 'Error has occurred!'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
         });
     });
}

exports.updateBook = function(req, res) {
    var id = req.params.id;
    var book = req.body;
    console.log('Updating book: ' + id);
    console.log(JSON.stringify(book));
    db.collection('books', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, book, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating book: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(book);
            }
        });
    });
}

exports.deleteBook = function(req, res) {
    var id = req.params.id;
    console.log('Deleting book: ' + id);
    db.collection('books', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
}

var populateDB = function() {
 
    var books = [
        {
        "title": "The Reader",
        "author": "Bernhard Schlink",
        "coverArt": "the_reader.jpg",
        "description": "The Reader (Der Vorleser) is a novel by German law professor and judge Bernhard Schlink, published in Germany in 1995 and in the United States in 1997. The story is a parable, dealing with the difficulties post-war German generations have had comprehending the Holocaust; Ruth Franklin writes that it was aimed specifically at the generation Berthold Brecht called the Nachgeborenen, those who came after. Like other novels in the genre of Vergangenheitsbewältigung, the struggle to come to terms with the past, The Reader explores how the post-war generations should approach the generation that took part in, or witnessed, the atrocities. These are the questions at the heart of Holocaust literature in the late 20th and early 21st century, as the victims and witnesses die and living memory fades.",
        "tokens": [
            "The",
            "Reader",
            "Bernhard",
            "Schlink"
        ]
    },
    {
        "title": "Layer Cake",
        "author": "J.J. Connolly",
        "coverArt": "layer_cake.jpg",
        "description": "Our narrator’s too smart to tell you his name (“if I [did], you’d be as clever as me”), but he’s not afraid to tell you everything else about the “layer cake”—London’s intricately arranged constellation of underworld fiefdoms. The worst thing about drug dealing—according to our unnamed narrator—whether you're a classy top dealer trading millions or a down-and-out street pusher, is that you have to relate to a lot of total idiots - loudmouths and tough-guy wannabes who aren't afraid to \"get nicked by old bill and thrown in the boob\"",
        "tokens": [
            "Layer",
            "Cake",
            "JJ",
            "J.J.",
            "Connolly"
        ]
    },
    {
        "title": "Lord of the Rings",
        "author": "J.R.R. Tolkein",
        "coverArt": "lord_of_the_rings.png",
        "description": "",
        "tokens": [
            "Lord",
            "of",
            "the",
            "Rings",
            "J.R.R.",
            "JRR",
            "Tolkein"
        ]
    },
    {
        "title": "The Medium is the Massage",
        "author": "Marshall McLuhan",
        "coverArt": "the_medium_is_the_massage.png",
        "description": "",
        "tokens": [
            "the",
            "medium",
            "is",
            "massage",
            "marshall",
            "mcluhan"
        ]
    }];

    db.collection('books', function(err, collection) {
        collection.insert(books, {safe:true}, function(err, result) {});
    });

};
