import React from 'react';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  users: Yup.array().of(
    Yup.object({
      name: Yup.string().required('Имя обязательно'),
      age: Yup.number().required('Обязательно').min(0, 'Возраст >= 0'),
      email: Yup.string().email('Некорректный email').required('Обязательно'),
      phone: Yup.string().matches(/^[0-9+\-\s()]+$/, 'Неверный формат').required('Обязательно'),
      children: Yup.array().of(
        Yup.object({
          childName: Yup.string().required('Имя ребенка обязательно'),
          childAge: Yup.number().required('Обязательно').min(0, 'Возраст >= 0'),
        })
      ),
    })
  ),
});

const UserForm = () => {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1>Список пользователей</h1>
      
      <Formik
        initialValues={{
          users: [
            { name: '', age: '', email: '', phone: '', children: [{ childName: '', childAge: '' }] }
          ],
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          console.log('Данные формы:', values);
          alert('Успешно! Проверьте консоль.');
        }}
      >
        {({ values, isSubmitting }) => (
          <Form>
            <FieldArray name="users">
              {({ push, remove, form }) => (
                <div>
                  {values.users.map((user, userIndex) => (
                    <div key={userIndex} style={{ border: '1px solid #ddd', padding: '20px', marginBottom: '20px', borderRadius: '8px', background: '#f9f9f9' }}>
                      <h3>Пользователь #{userIndex + 1}</h3>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <div>
                          <label>Имя</label>
                          <Field name={`users[${userIndex}].name`} style={{ width: '100%', padding: '8px' }} />
                          <ErrorMessage name={`users[${userIndex}].name`} component="div"/>
                        </div>

                        <div>
                          <label>Возраст</label>
                          <Field name={`users[${userIndex}].age`} type="number" style={{ width: '100%', padding: '8px' }} />
                          <ErrorMessage name={`users[${userIndex}].age`} component="div"/>
                        </div>

                        <div>
                          <label>Email</label>
                          <Field name={`users[${userIndex}].email`} type="email" style={{ width: '100%', padding: '8px' }} />
                          <ErrorMessage name={`users[${userIndex}].email`} component="div"/>
                        </div>

                        <div>
                          <label>Телефон</label>
                          <Field name={`users[${userIndex}].phone`} type="tel" style={{ width: '100%', padding: '8px' }} />
                          <ErrorMessage name={`users[${userIndex}].phone`} component="div"/>
                        </div>
                      </div>

                      <div style={{ marginTop: '20px', paddingLeft: '20px', borderLeft: '4px solid #ccc' }}>
                        <h4>Дети:</h4>
                        
                        <FieldArray name={`users[${userIndex}].children`}>
                          {({ push: pushChild, remove: removeChild }) => (
                            <div>
                              {user.children.map((child, childIndex) => (
                                <div key={childIndex} style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'flex-end' }}>
                                  <div style={{ flex: 2 }}>
                                    <label style={{fontSize: '12px'}}>Имя ребенка</label>
                                    <Field 
                                      name={`users[${userIndex}].children[${childIndex}].childName`} 
                                      placeholder="Имя"
                                      style={{ width: '100%', padding: '6px' }} 
                                    />
                                    <ErrorMessage name={`users[${userIndex}].children[${childIndex}].childName`} component="div"/>
                                  </div>

                                  <div style={{ flex: 1 }}>
                                    <label style={{fontSize: '12px'}}>Возраст</label>
                                    <Field 
                                      name={`users[${userIndex}].children[${childIndex}].childAge`} 
                                      type="number"
                                      placeholder="Возраст"
                                      style={{ width: '100%', padding: '6px' }} 
                                    />
                                    <ErrorMessage name={`users[${userIndex}].children[${childIndex}].childAge`} component="div"/>
                                  </div>

                                  <button 
                                    type="button" 
                                    onClick={() => removeChild(childIndex)}
                                    style={{ marginBottom: '10px', color: 'red', border: '1px solid red', background: 'white', cursor: 'pointer' }}
                                  >
                                    Удалить
                                  </button>
                                </div>
                              ))}
                              
                              <button 
                                type="button" 
                                onClick={() => pushChild({ childName: '', childAge: '' })}
                                style={{ fontSize: '13px', cursor: 'pointer' }}
                              >
                                + Добавить ребенка
                              </button>
                            </div>
                          )}
                        </FieldArray>
                      </div>

                      <div style={{ marginTop: '20px', borderTop: '1px dashed #ccc', paddingTop: '10px' }}>
                        <button 
                          type="button" 
                          onClick={() => remove(userIndex)}
                          style={{ width:'100%', fontWeight: 'bold', cursor: 'pointer' }}
                        >
                          Удалить пользователя
                        </button>
                      </div>
                    </div>
                  ))}

                  <button 
                    type="button" 
                    onClick={() => push({ name: '', age: '', email: '', phone: '', children: [] })}
                    style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
                  >
                    + Добавить пользователя
                  </button>
                </div>
              )}
            </FieldArray>

            <div style={{ marginTop: '30px', borderTop: '2px solid #333', paddingTop: '20px' }}>
              <button type="submit" disabled={isSubmitting} style={{ padding: '12px 24px', fontSize: '18px', cursor: 'pointer', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}>
                Отправить все данные
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default UserForm;