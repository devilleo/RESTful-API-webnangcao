module.exports = {
    findingRoom: function(data){
        // check player have been in room yet?
        for (var i = 0; i < listRooms.length; i+=1){
            if (listRooms[i].player1.email === data.email){
                return {idRoom: i, isPlayer1: true, room: listRooms[i]}
            }
            else if (listRooms[i].player2.email === data.email){
                return {idRoom: i, isPlayer1: false, room: listRooms[i]}
            }
        }

        for (var i = 0; i < listRooms.length; i+=1){
            if (listRooms[i].numbersInRoom < 2){
                if(listRooms[i].numbersInRoom === 1){
                    listRooms[i].player2 = data
                    listRooms[i].numbersInRoom+=1;
                    console.log("current rooms: ", listRooms)
                    return {idRoom: listRooms[i].idRoom, isPlayer1: false, room: listRooms[i]}
                }
            }
        }
        var idRoom = (new Date()) 
        var newRoom = new Room(idRoom, 1, data,  {}, [], [], true, 0)
        listRooms.push(newRoom)
        console.log("current rooms: ", listRooms)
        return {idRoom: idRoom, isPlayer1: true, room: listRooms[i]}
    },
    sendMessage: function(idRoom, email, isPlayer1, message, time){
        if (listRooms.length === 0)
            return false
        for (var i = 0; i< listRooms.length; i+=1){
            if (listRooms[i].idRoom === idRoom){
                listRooms[i].message.push({email: email, isPlayer1: isPlayer1, message: message, time: time})
                listRooms[i].message.forEach(value => {
                console.log(value.message)
                })
            return listRooms[i]
            }
        }
    },
    getInfoCurrentRoom: function(idRoom){
        for (var i = 0; i< listRooms.length; i+=1){
            if (listRooms[i].idRoom === idRoom){
                return listRooms[i]
            }
        }
    },

    addSquareTogged: function(idSquare, idRoom) {
        for (var i = 0; i< listRooms.length; i+=1){
            if (listRooms[i].idRoom === idRoom){
                listRooms[i].listSquareTogged.push(idSquare)
                console.log("list square: ", listRooms[i].listSquareTogged)
            }
        }
        
    }, 

    changeTurn: function(idRoom){
        for (var i = 0; i< listRooms.length; i+=1){
            if (listRooms[i].idRoom === idRoom){
                listRooms[i].currentTurn = !listRooms[i].currentTurn
            }
        }
    },

    getListSquareTogged: function(idRoom){
        for (var i = 0; i< listRooms.length; i+=1){
            if (listRooms[i].idRoom === idRoom){
                console.log("list square togged: ", listRooms[i].listSquareTogged)
                return listRooms[i].listSquareTogged
            }
        }
    },

    getCurrentTurn: function(idRoom){
        for (var i = 0; i< listRooms.length; i+=1){
            if (listRooms[i].idRoom === idRoom){
                return listRooms[i].currentTurn
            }
        }
    },
    resetGame: function(idRoom){
        for (var i = 0; i< listRooms.length; i+=1){
            if (listRooms[i].idRoom === idRoom){
                listRooms[i].listSquareTogged = []
                listRooms[i].currentTurn = true
            }
        }
    },
    setNumbersOfAcceptPlayAgain: function(idRoom){
        for (var i = 0; i< listRooms.length; i+=1){
            if (listRooms[i].idRoom === idRoom){
                listRooms[i].numbersOfAcceptPlayAgain += 1
            }
        }
    },
    getNumbersOfAcceptPlayAgain: function(idRoom){
        for (var i = 0; i< listRooms.length; i+=1){
            if (listRooms[i].idRoom === idRoom){
                return listRooms[i].numbersOfAcceptPlayAgain
            }
        }
    },
    resetNumbersOfAcceptPlayAgain: function(idRoom){
        for (var i = 0; i< listRooms.length; i+=1){
            if (listRooms[i].idRoom === idRoom){
                listRooms[i].numbersOfAcceptPlayAgain = 0
            }
        }
    },

    eraseRoom: function(idRoom){
        var index = -1
        for (var i = 0; i < listRooms.length; i+=1){
            if (listRooms[i].idRoom === idRoom){
                index = i
                break
            }
        }
        listRooms.splice(index,1)
        console.log("list room sau khi xoa: ", listRooms)
    },

    outRoom: function(data){

    }
}

var listRooms = Array();
class Room{
    constructor(idRoom, numbersInRoom, player1, player2, message, listSquareTogged, currentTurn, numbersOfAcceptPlayAgain){
        this.idRoom = idRoom;
        this.numbersInRoom = numbersInRoom;
        this.player1 = player1;
        this.player2 = player2;
        this.message = message;
        this.listSquareTogged = listSquareTogged
        this.currentTurn = currentTurn
        this.numbersOfAcceptPlayAgain = numbersOfAcceptPlayAgain
    }
}