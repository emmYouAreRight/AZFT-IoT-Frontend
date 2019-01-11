import React from 'react';
import { connect } from 'dva';
import { Spin, List } from 'antd';
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
        const rurl = new String(result.hardwareConnectionImg);
        const imgurl = 'http://47.97.217.32/tinylink/'+rurl.substring(3);
        const getResult = () => {
            let res = "";
            if(result.systemState == "1") {
                res = 'Success';
            }
            else
            {
                res = 'Failed';
            }
            
            if(result.status == 'ok') {
                return(
                <div>
                    <h2>文件路径: {path}</h2>
                    <h2>projectname: {projectname}</h2>
                    <List>
                        <List.Item>
                            <List.Item.Meta
                            title= '运行结果'
                            description={res}
                            />
                        </List.Item>
                        <List.Item>
                            <List.Item.Meta
                            title= '功能列表'
                            description={result.functionList}
                            />
                        </List.Item>
                        <List.Item
                         extra={<img width={870} alt="hardwareimg" src={imgurl} />}
                        >
                            <List.Item.Meta
                            title= '硬件连接图'
                            />
                        </List.Item>
                        <List.Item>
                            <List.Item.Meta
                            title= '编译结果'
                            description={result.compileDebug} 
                            />
                        </List.Item>
                    </List>
                </div>);
                }
                else
                {
                    return(<Spin size='large' />);
                }
            }
    
        console.log(imgurl);
        return (
            <div className="tiny-body">
                {getResult()}
               
            </div>
        )
    };

}

export default TinylinkPage;