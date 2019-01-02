import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import Link from 'umi/link';
import router from 'umi/router';
import { Form, Radio, Input, Button, Select, DatePicker, Row, Col, Popover, Progress } from 'antd';
import styles from './Register.less';

const FormItem = Form.Item;
const { Option } = Select;
const RadioGroup = Radio.Group;
const InputGroup = Input.Group;

const passwordStatusMap = {
  ok: (
    <div className={styles.success}>
      <FormattedMessage id="validation.password.strength.strong" />
    </div>
  ),
  pass: (
    <div className={styles.warning}>
      <FormattedMessage id="validation.password.strength.medium" />
    </div>
  ),
  poor: (
    <div className={styles.error}>
      <FormattedMessage id="validation.password.strength.short" />
    </div>
  ),
};

const passwordProgressMap = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
};

@connect(({ register, loading }) => ({
  register,
  submitting: loading.effects['register/submit'],
}))
@Form.create()
class Register extends Component {
  state = {
    count: 0,
    confirmDirty: false,
    visible: false,
    help: '',
  };

  componentDidUpdate() {
    const { form, register } = this.props;
    const account = form.getFieldValue('username');
    if (register.status === 'ok') {
      router.push({
        pathname: '/user/register-result',
        state: {
          account,
        },
      });
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }
  
  getPasswordStatus = () => {
    const { form } = this.props;
    const value = form.getFieldValue('pass1');
    if (value && value.length > 9) {
      return 'ok';
    }
    if (value && value.length > 5) {
      return 'pass';
    }
    return 'poor';
  };

  handleSubmit = e => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    form.validateFields({ force: true }, (err, values) => {
      if (!err) {
        const { prefix } = this.state;
        dispatch({
          type: 'register/submit',
          payload: {
            ...values,
            prefix,
          },
        });
      }
    });
  };

  handleConfirmBlur = e => {
    const { value } = e.target;
    const { confirmDirty } = this.state;
    this.setState({ confirmDirty: confirmDirty || !!value });
  };

  checkConfirm = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('pass1')) {
      callback(formatMessage({ id: 'validation.password.twice' }));
    } else {
      callback();
    }
  };

  checkPassword = (rule, value, callback) => {
    const { visible, confirmDirty } = this.state;
    if (!value) {
      this.setState({
        help: formatMessage({ id: 'validation.password.required' }),
        visible: !!value,
      });
      callback('error');
    } else {
      this.setState({
        help: '',
      });
      if (!visible) {
        this.setState({
          visible: !!value,
        });
      }
      if (value.length < 5) {
        callback('error');
      } else {
        const { form } = this.props;
        if (value && confirmDirty) {
          form.validateFields(['pass2'], { force: true });
        }
        callback();
      }
    }
  };

  renderPasswordProgress = () => {
    const { form } = this.props;
    const value = form.getFieldValue('pass1');
    const passwordStatus = this.getPasswordStatus();
    return value && value.length ? (
      <div className={styles[`progress-${passwordStatus}`]}>
        <Progress
          status={passwordProgressMap[passwordStatus]}
          className={styles.progress}
          strokeWidth={5}
          percent={value.length * 10 > 100 ? 100 : value.length * 10}
          showInfo={false}
        />
      </div>
    ) : null;
  };

  render() {
    const { form, submitting } = this.props;
    const { getFieldDecorator } = form;
    const { count, prefix, help, visible } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 14,
          offset: 6,
        },
      },
    };
    return (
      <div className={styles.main}>
        <h3>
          <FormattedMessage id="app.register.register" />
        </h3>
        <Form onSubmit={this.handleSubmit}>
          <FormItem>
            {getFieldDecorator('full_name', {
              rules: [{
                required: true, 
                message: formatMessage({ id: 'validation.full_name.required' }),
              }],
            })(
              <Input size='large' placeholder={formatMessage({ id: 'form.full_name.placeholder' })}/>
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('username', {
              rules: [{
                required: true, 
                message: formatMessage({ id: 'validation.username.required' }),
              }],
            })(
              <Input size='large' placeholder={formatMessage({ id: 'form.username.placeholder' })}/>
            )}
          </FormItem>

          <FormItem help={help}>
            <Popover
              getPopupContainer={node => node.parentNode}
              content={
                <div style={{ padding: '4px 0' }}>
                  {passwordStatusMap[this.getPasswordStatus()]}
                  {this.renderPasswordProgress()}
                  <div style={{ marginTop: 10 }}>
                    <FormattedMessage id="validation.password.strength.msg" />
                  </div>
                </div>
              }
              overlayStyle={{ width: 240 }}
              placement="right"
              visible={visible}
            >
              {getFieldDecorator('pass1', {
                rules: [
                  {
                    validator: this.checkPassword,
                  },
                ],
              })(
                <Input
                  size='large'
                  type="password"
                  placeholder={formatMessage({ id: 'form.password.placeholder' })}
                />
              )}
            </Popover>
          </FormItem>
          <FormItem>
              {getFieldDecorator('pass2', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'validation.confirm-password.required' }),
                  },
                  {
                    validator: this.checkConfirm,
                  },
                ],
              })(
                <Input
                  size='large'
                  type="password"
                  placeholder={formatMessage({ id: 'form.confirm-password.placeholder' })}
                />
              )}
            </FormItem>

          <FormItem>
            {getFieldDecorator('birthday', {
            rules: [{ 
              type: 'object', 
              required: true, 
              message: formatMessage({ id: 'validation.birthday.required' }),
              }],
            })(
              <DatePicker 
              style={{ width: '100%' }}
              size='large'
              placeholder={formatMessage({ id: 'form.birthday.placeholder' })}
              />
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label= {formatMessage({ id: 'form.gender.placeholder' })}
          >
            {getFieldDecorator('gender', {
              rules: [{ 
                required: true, 
                message: formatMessage({ id: 'validation.gender.required' }),
              }],
            })(
              <RadioGroup>
                <Radio value="1">男</Radio>
                <Radio value="0">女</Radio>
              </RadioGroup>
            )}
          </FormItem>

          <FormItem>
            {getFieldDecorator('education', {
              rules: [{ 
                required: true, 
                message: formatMessage({ id: 'validation.education.required' }),
              }],
            })(
              <Select size='large' placeholder={formatMessage({ id: 'form.education.placeholder' })}>
                <Option value="Doctor and above">Doctor and above</Option>
                <Option value="Master">Master</Option>
                <Option value="Undergraduate">Undergraduate</Option>
                <Option value="High School and below">High School and below</Option>
              </Select>
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('job', {
              rules: [{ 
                required: true, 
                message: formatMessage({ id: 'validation.job.required' }),
              }],
            })(
              <Select size='large' placeholder={formatMessage({ id: 'form.job.placeholder' })}>
                <Option value="Student">Student</Option>
                <Option value="Teacher">Teacher</Option>
                <Option value="Researcher">Researcher</Option>
                <Option value="Developer">Developer</Option>
                <Option value="Others">Others</Option>
              </Select>
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('iOT_familiar', {
              rules: [{ 
                required: true, 
                message: formatMessage({ id: 'validation.iOT_familiar.required' }), 
              }],
            })(
              <Select size='large' placeholder={formatMessage({ id: 'form.iOT_familiar.placeholder' })}>
                <Option value="None">None</Option>
                <Option value="A Little">A Little</Option>
                <Option value="Medium">Medium</Option>
                <Option value="A Lot">A Lot</Option>
              </Select>
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('embeded_familiar', {
              rules: [{ 
                required: true, 
                message: formatMessage({ id: 'validation.embeded_familiar.required' }), 
              }],
            })(
              <Select size='large' placeholder={formatMessage({ id: 'form.embeded_familiar.placeholder' })}>
                <Option value="None">None</Option>
                <Option value="A Little">A Little</Option>
                <Option value="Medium">Medium</Option>
                <Option value="A Lot">A Lot</Option>
              </Select>
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('lan_familiar', {
              rules: [{ 
                required: true, 
                message: formatMessage({ id: 'validation.lan_familiar.required' }), 
              }],
            })(
              <Select size='large' placeholder={formatMessage({ id: 'form.lan_familiar.placeholder' })}>
                <Option value="None">None</Option>
                <Option value="A Little">A Little</Option>
                <Option value="Medium">Medium</Option>
                <Option value="A Lot">A Lot</Option>
              </Select>
            )}
          </FormItem>
          <FormItem {...tailFormItemLayout}>
            <Button
              loading={submitting}
              className={styles.submit}
              type="primary"
              htmlType="submit"
            >
              <FormattedMessage id="app.register.register" />
            </Button>
            <Link className={styles.login} to="/User/Login">
              <FormattedMessage id="app.register.sign-in" />
            </Link>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default Register;
