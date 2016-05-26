/**
 * Created by Administrator on 2016/5/24.
 * 使用KNN临近算法进行定位
 */
function onRequest(request, response, modules) {
    //获得oData的对象
    var db = modules.oData;
    // console.log(request.body);
    var num = request.body.num;
    var bssids = "\"BSSIDs\":[";
    var rssis = "\"RSSIs\":[";
    for (var i = 0; i < num; i++) {
        switch (i) {
            case 0:
                bssids += "\"" + request.body.B1 + "\",";
                rssis += "\"" + request.body.R1 + "\",";
                break;
            case 1:
                bssids += "\"" + request.body.B2 + "\",";
                rssis += "\"" + request.body.R1 + "\",";
                break;
            case 2:
                bssids += "\"" + request.body.B3 + "\",";
                rssis += "\"" + request.body.R3 + "\",";
                break;
            case 3:
                bssids += "\"" + request.body.B4 + "\",";
                rssis += "\"" + request.body.R4 + "\",";
                break;
            case 4:
                bssids += "\"" + request.body.B5 + "\",";
                rssis += "\"" + request.body.R5 + "\",";
                break;
            case 5:
                bssids += "\"" + request.body.B6 + "\",";
                rssis += "\"" + request.body.R6 + "\",";
                break;
            case 6:
                bssids += "\"" + request.body.B7 + "\",";
                rssis += "\"" + request.body.R7 + "\",";
                break;
            case 7:
                bssids += "\"" + request.body.B8 + "\",";
                rssis += "\"" + request.body.R8 + "\",";
                break;
            case 8:
                bssids += "\"" + request.body.B9 + "\",";
                rssis += "\"" + request.body.R9 + "\",";
                break;
            case 8:
                bssids += "\"" + request.body.B10 + "\",";
                rssis += "\"" + request.body.R10 + "\",";
                break;
            default:
                break;
        }

    }
    bssids = bssids.substr(0, bssids.length - 1);
    rssis = rssis.substr(0, rssis.length - 1);
    bssids += "]";
    rssis += "]";
    result2 = bssids + "," + rssis;
    result2 = "{" + result2 + "}";
    result2 = JSON.parse(result2);

    db.find({
        "table": "WifiInfo"
    }, function (err, data) {
        //将data对象转化为json对象
        var resultObject = JSON.parse(data);
        //获取每行的值
        // console.log(resultObject);
        var minDistance = 100000;
        var location;

        function distanceOf(result, result2) {
            var distance = 0;
            // console.log("result=\n" + result);
            // console.log(result.BSSIDs["1"]);
            // console.log("result2=\n" + result2);
            for (var p1 in result.BSSIDs) {
                if (result.BSSIDs[p1].length != 17) {
                    break;//更对Bmob云逻辑，不加这个判断会出现错误！！
                }
                var BSSID = result.BSSIDs[p1];
                // console.log("bssid" + BSSID);
                var RSSI = result.RSSIs[p1];
                // console.log("rssi" + RSSI);
                var find = false;
                for (var p2 in result2.BSSIDs) {

                    if (result2.BSSIDs[p2] == BSSID) {
                        find = true;
                        distance += Math.pow(result2.RSSIs[p2] - RSSI, 2);
                        break;
                    }
                }
                if (!find) {
                    distance += Math.pow(RSSI, 2);
                }
            }
            for (var p1 in result2.BSSIDs) {
                var BSSID = result2.BSSIDs[p1];
                if (BSSID.length != 17) {
                    break;
                }
                // console.log("bssid" + BSSID);
                var RSSI = result2.RSSIs[p1];
                // console.log("rssi" + RSSI);
                var find = false;
                for (var p2 in result.BSSIDs) {
                    if (result.BSSIDs[p2] == BSSID) {
                        find = true;
                        distance += Math.pow(result.RSSIs[p2] - RSSI, 2);
                        break;
                    }
                }
                if (!find) {
                    distance += Math.pow(RSSI, 2);
                }
            }
            return distance;
        }

        for (var results in resultObject) {
            /**
             * @resultArr 是WifiInfo表中的所有行
             */
            var resultArr = resultObject[results];
            // console.log(resultArr);
            for (var oneLine in resultArr) {
                /**
                 * @result 对应wifiInfo表中的一行
                 * 包含的信息包括 地理位置信息和对应的wifi链表信息
                 * 但wifi链表的长度是不定的
                 */
                var result = resultArr[oneLine];
                // console.log(result);
                // console.log(request.body);
                var distance = distanceOf(result, result2);
                console.log(distance + "\n");
                if (distance < minDistance) {
                    minDistance = distance;
                    location = result;
                    // console.log(location);
                }
            }
        }
        // response.end(location);
        console.log(location.BuildingName + location.RoomName + "(x=" + location.x + ",y=" + location.y + ")");
        var re = "{\"BuildingName\":\""+location.BuildingName+"\",\"RoomName\":\""+ location.RoomName+"\",\"x\":"+ location.x+",\"y\":" +location.y+"}";
        console.log(re);
    });
}
exports.locate = onRequest;