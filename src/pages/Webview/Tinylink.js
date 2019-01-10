import React from 'react';
import { connect } from 'dva';
import { Button } from 'antd';
import styles from './Tinylink.less';

@connect(({ result }) => ({
    result,
  }))

class TinylinkPage extends React.Component {
    state = {
        path: "",
        projectname: ""
      }


    componentDidMount() {
        const { path, projectname } = this.state;
        const { dispatch } = this.props;
        var url = location.search; //获取url中"?"符后的字串 
        console.log(url);
       
        var theRequest = new Array(); 
        if (url.indexOf("?") != -1) {
            var str = url.substr(1); 
            var strs = str.split("&"); 
            for(var i = 0; i < strs.length; i ++) {
                theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]); 
            } 
        }
        const filepath = theRequest.path;
        const proname = theRequest.projectname; 
        this.setState({ path: filepath });
        this.setState({ projectname: proname });
        console.log(path);
        console.log(projectname);
        dispatch({
          type: 'result/tinylinkResult',
          payload: {
            filepath,
            proname
          },
        });
      };
     

    render() {
        
        const {
            result: {result}
        } = this.props;
        const { path , projectname } = this.state;
        console.log('==================render=====================');
        console.log(result);
        const getRequest = () => {
            return path
          }
        const rurl = new String(result.hardwareConnectionImg);
        const imgurl = 'http://47.97.217.32/tinylink/'+rurl.substring(3);
        const getRunstate = () => {
            let res = "";
            if(result.systemState == "1") {
                res = 'Success';
            }
            else
            {
                res = 'Failed';
            }
            return res;
        }
        console.log(imgurl);
        return (
            <div className="tiny-body">
                <h2>文件路径: {getRequest()}</h2>
                <h2>projectname: {projectname}</h2>

                <h2>运行结果</h2>
                    <div>
                        {getRunstate()}<br />
                    </div>
                <h2>功能列表</h2>
                <div>
                    {result.functionList}
                </div>
                <h2>硬件连接图</h2>
                <div>
                    <img className={styles.hardwareImg} src={imgurl} />
                </div>
                <h2>编译结果</h2>
                <div>
                    {result.compileDebug}   
                </div>
            </div>
        )
    };

}

export default TinylinkPage;