import React, {useState, useEffect} from 'react'
import { Table, Popconfirm, Button, Space, Form, Input, Select } from 'antd';

const DataTable = ({todos, handleDelete, isEditing, setEditRowKey, setTodos}) => {
    const [sortedInfo, setSortedInfo] = useState({});
    const [form] = Form.useForm();
    const [searchText, setSearchText] = useState("");
    const [filteredTodos, setFilteredTodos] = useState(todos);

    const cancel = () => {
      setEditRowKey("");
    };

    const save = async (id) => {
      try {
        const row = await form.validateFields();
        const newData = [...todos];
        const index = newData.findIndex((item) => id === item.id);
        if(index > -1) {
          const item = newData[index];
          newData.splice(index, 1, {...item, ...row});
          setTodos(newData);
          setEditRowKey("");
        }
      } catch (error) {
        console.log("error", error);
      }
    };

    const edit = (record) => {
      form.setFieldsValue({
        title: "",
        description: "",
        dueDate: "",
        tags: "",
        status: "",
        ...record
      });
      setEditRowKey(record.id);
    };

    const handleChange = (...sorter) => {
      console.log("sorter", sorter);
      const {order, field} = sorter[2];
      setSortedInfo({columnKey: field, order});
    }

    const handleInputChange = (e) => {
      setSearchText(e.target.value);
    }

    const globalSearch = () => {
      const searchedTodos = todos.filter((todo) => {
        return (
          todo.title.toLowerCase().includes(searchText.toLocaleLowerCase()) || 
          todo.description.toLowerCase().includes(searchText.toLocaleLowerCase()) || 
          todo.tags.toLowerCase().includes(searchText.toLocaleLowerCase()) || 
          todo.dueDate.toLowerCase().includes(searchText.toLocaleLowerCase()) || 
          todo.status.toLowerCase().includes(searchText.toLocaleLowerCase())
        );
      });
      setFilteredTodos(searchText == "" ? todos : searchedTodos);
    }

    const columns = [
        // {
        //     title : "ID",
        //     dataIndex: "id",
        //     align: "center",
        //     sorter: (a, b) => a.id - b.id,
        //     sortOrder: sortedInfo.columnKey === "id" && sortedInfo.order,
        // },
        {
            title: "TimeStamp",
            dataIndex: "timeStamp",
            align: "center",
        },

        {
            title: "Title",
            dataIndex: "title",
            editTable: "true",
            sorter: (a, b) => a.title.length - b.title.length,
            sortOrder: sortedInfo.columnKey === "title" && sortedInfo.order,
        },

        {
            title: "Description",
            dataIndex: "description",
            align: "center",
            editTable: "true"
        },

        {
            title: "Due Date",
            dataIndex: "dueDate",
            align: "center",
            editTable: "true",
            sorter: (a, b) => new Date(a.dueDate) - new Date(b.dueDate),   
            sortOrder: sortedInfo.columnKey === "dueDate" && sortedInfo.order,
        },

        {
            title: "Tag",
            dataIndex: "tags",
            align: "center",
        },

        {
            title: "Status",
            dataIndex: "status",
            align: "center",
            editTable: "true"
        },
        
        {
          title: "Action",
          dataIndex: "action",
          align: "center",
          render: (_, record) => {
            const editable = isEditing(record);
            return todos.length > 0  ? (
              <Space>
                {!editable ? 
                  <Popconfirm title="Are you sure, you want to delete?" onConfirm={() => handleDelete(record)}>
                    <Button danger type='primary' disabled={editable}>Delete</Button>
                  </Popconfirm> : 
                  <Button danger type='primary' disabled={editable}>Delete</Button>
                }

                {
                  editable ? (
                    <span>
                      <Space size="middle">
                        <Button onClick={() => save(record.id)} type="primary" style={{marginRight: 8}}>Save</Button>
                        <Popconfirm title="Are you sure, you want to cancel?" onConfirm={cancel}>
                          <Button>Cancel</Button>
                        </Popconfirm>
                      </Space>
                    </span>
                  ) : (
                    <Button type='primary' onClick={() => edit(record)}>Edit</Button>
                  )
                }
                
              </Space>
            ) : null
          }
        }
    ]

    const mergedColumns = columns.map((col) => {
      if(!col.editTable) {
        return col;
      }

      return {
        ...col,
        onCell: (record) => ({
          record, 
          title: col.title,
          dataIndex: col.dataIndex,
          editing: isEditing(record),
        }),
      };
    });

    const statuses = ["Open", "Working", "Done", "Overdue"];
    const EditableCell = ({editing, dataIndex, title, record, children, ...restProps}) => {
      const input = <Input />;
      const input2 = <Select placeholder="Select status">
        {statuses.map((Status, index) => {
          return <Select.Option key={index} value={Status}></Select.Option>
        })}
      </Select>

      return (
        <td {...restProps}>
          {
          editing 
          ? (
            dataIndex != 'status' 
            ? 
              <Form.Item name={dataIndex} style={{margin: 0}} rules={[{
                required: true,
                message: `Please input some value in ${title} field`
              }]}>
                {input}
              </Form.Item> 
            : 
              <Form.Item name={dataIndex} style={{margin: 0}} rules={[{
              }]}>
                {input2}
              </Form.Item>
              ) 
          : 
            children
          }
        </td>
      )
    }


  useEffect(() => {
    if (searchText == ""){
      setFilteredTodos(todos)
    } else {
      globalSearch()
    }
  }, [searchText])

  useEffect(() => {
    setFilteredTodos(todos)
  }, [todos])
    
  return (
    <div>
      <Space style={{ marginBottom: 10, marginLeft: 5, marginTop: 4}}>
        <Input placeholder='Search here' type="text" allowClear value={searchText} onChange={handleInputChange}/>
        <Button type='primary' onClick={globalSearch} style={{fontSize: 14, fontWeight: 'bold'}}>Search</Button>
      </Space>
      <Form form={form} component={false}>
        <Table 
          columns = {mergedColumns}
          components = {{
            body: {
              cell: EditableCell,
            } 
          }}
          dataSource = {filteredTodos}
          bordered
          onChange={handleChange}
          pagination={{
            pageSize: 5
          }}
        />
      </Form>
    </div>
  )
}

export default DataTable
