/**
 * Created by Administrator on 2016/5/22.
 */
/**
 *Bmob提供的快速获取某一个objectId的排序的算法
 *上传一个objectId上去，直接知道这条数据的某个字段值（云端代码里面指定）在整个表的排序
 */
function onRequest(request, response, modules) {


    var db = modules.oData;
    //tableName是需要用到排序的表名，可以根据你的实际情况更换
    var tableName= "Person";
    //这个objectId可以通过request.body.参数名 从SDK中传上来
    var objectId ="	848d519fef";

    //先获取该数据的分数
    db.find({
        "table":tableName
    },function(err,data){
        response.send(data);
    });
}