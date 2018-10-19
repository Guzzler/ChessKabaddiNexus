var fs = require('fs')
var rawData;
var positionArray=[24,10,3,5];
var finalArray=[];
fs.readFile('./CollectedGameData.json', function read(err, data) {
    if (err) {
        throw err;
    }

    rawData= JSON.parse(data);
    for (var i=0;i<rawData.length;i++){
        
        var totLength=rawData[i].length;
        var initPosition=[24,10,3,5];
        initPosition.push(totLength);
        finalArray.push(initPosition);
        for (var j=0;j<totLength;j++){
            initPosition[4]-=1;
            if (rawData[i][j].PieceID!=0){
                initPosition[rawData[i][j].PieceID-1]=rawData[i][j].Position;
            }
            else{
            	initPosition[rawData[i][j].PieceID]=rawData[i][j].Position;
            }
            console.log(initPosition)
            var push_array=initPosition.slice();
            finalArray.push(push_array);
        }
    }
    fs.writeFile('CleanData.json',JSON.stringify(finalArray),function write(err){
       if (err) throw err;
       console.log('cleaned and written successfully');
    });
});

