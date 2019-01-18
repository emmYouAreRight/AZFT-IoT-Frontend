import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Spin, List, Card, Button } from 'antd';
import Result from '@/components/Result';
import styles from './Tinylink.less';

@connect(({ result, loading }) => ({
    result,
    loading : loading.models.result
  }))


  
class TinylinkPage extends React.Component {
    state = {
        path: "",
        projectname: ""
      }

    handleBack = () => {
        window.close();
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
            result: {result},
            loading
        } = this.props;
        const { path , projectname } = this.state;
        console.log('==================render=====================');
        console.log(result);
        
        const rurl = new String(result.hardwareConnectionImg);
        const imgurl = 'http://47.97.217.32/tinylink/'+rurl.substring(3);
        const getfunctionList =() => {
            let strs = new Array();
            strs = String(result.functionList).split('\r\n');
            const funcstr = strs.map((item) => <li>{item}</li>);
            return (<ol>{funcstr}</ol>);
        } 
        
        const getcompileDebug =() => {
            let strs = new Array();
            strs = String(result.compileDebug).split('\n');
            const compstr = strs.map((item) => <li>{item}</li>);
            return (<ol>{compstr}</ol>);
        }
        const getResult = () => {
            let res = '';
            let title, info, resextra, actions;

            if(result.systemState == "1") {
                res = 'success';
                title = '编译成功';
                info = '请按照硬件连接图进行组装硬件，确认连接正确后一键烧写';
                resextra = (
                    <Fragment>
                        <List>
                        <List.Item>
                            <List.Item.Meta
                            title= '功能列表'
                            description={getfunctionList()}
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
                            description={getcompileDebug()} 
                            
                            />
                        </List.Item>
                        </List>
                    </Fragment>)
                actions = (
                    <Fragment>
                      <Button type="primary">
                        一键烧写
                      </Button>
                    </Fragment>
                  );
                
            }
            else
            {
                res = 'error';
                title = '编译失败';
                info = '请修改代码后重新编译';
                resextra = (
                    <Fragment>
                        <List>
                            <List.Item>
                            <List.Item.Meta
                                title= '详细信息'
                                description={result.verbose} 

                            />
                            </List.Item>
                        </List>
                    </Fragment>
                )

                actions = (
                    <Fragment>
                        <Button type="primary" onClick={this.handleBack}>
                        返回修改
                        </Button>
                    </Fragment>
                )

            }
            return (
                <Result 
                    type= {res}
                    title={title}
                    description={info}
                    extra={resextra}
                    actions={actions}
                    style={{ marginTop: 48, marginBottom: 16 }}
                />
                
            )       
        }
        
        console.log(imgurl);
        return (
        <Card bordered={false} loading={loading}>
            {getResult()}
        </Card>
        )
    };

}

export default TinylinkPage;