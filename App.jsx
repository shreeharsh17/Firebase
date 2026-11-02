
import React, {useEffect, useState} from 'react';

import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';

import {
  getFirestore,
  collection,
  onSnapshot,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
} from '@react-native-firebase/firestore';

const db = getFirestore();

const App = () => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [course, setCourse] = useState('');
  const [students, setStudents] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // READ - Listen for student records
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'students'),
      snapshot => {
        const studentList = snapshot.docs.map(item => ({
          id: item.id,
          ...item.data(),
        }));

        setStudents(studentList);
      },
      error => {
        console.log('Read error:', error);
        Alert.alert('Error', 'Could not load students');
      },
    );

    return unsubscribe;
  }, []);

  // CLEAR FORM
  const clearForm = () => {
    setName('');
    setAge('');
    setCourse('');
    setEditingId(null);
  };

  // CREATE - Add student
  const addStudent = async () => {
    if (!name.trim() || !age.trim() || !course.trim()) {
      Alert.alert('Error', 'Please enter all fields');
      return;
    }

    try {
      await addDoc(collection(db, 'students'), {
        name: name.trim(),
        age: Number(age),
        course: course.trim(),
      });

      Alert.alert('Success', 'Student added');
      clearForm();
    } catch (error) {
      console.log('Add error:', error);
      Alert.alert('Error', 'Could not add student');
    }
  };

  // UPDATE - Update student
  const updateStudent = async () => {
    if (!name.trim() || !age.trim() || !course.trim()) {
      Alert.alert('Error', 'Please enter all fields');
      return;
    }

    try {
      await updateDoc(doc(db, 'students', editingId), {
        name: name.trim(),
        age: Number(age),
        course: course.trim(),
      });

      Alert.alert('Success', 'Student updated');
      clearForm();
    } catch (error) {
      console.log('Update error:', error);
      Alert.alert('Error', 'Could not update student');
    }
  };

  // DELETE - Delete student
  const deleteStudent = async id => {
    try {
      await deleteDoc(doc(db, 'students', id));
      Alert.alert('Success', 'Student deleted');

      if (editingId === id) {
        clearForm();
      }
    } catch (error) {
      console.log('Delete error:', error);
      Alert.alert('Error', 'Could not delete student');
    }
  };

  // EDIT - Load student details into form
  const editStudent = student => {
    setName(student.name ?? '');
    setAge(String(student.age ?? ''));
    setCourse(student.course ?? '');
    setEditingId(student.id);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Firebase Student CRUD</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter Age"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Enter Course"
        value={course}
        onChangeText={setCourse}
      />

      <Button
        title={editingId ? 'Update Student' : 'Add Student'}
        onPress={editingId ? updateStudent : addStudent}
      />

      {editingId !== null && (
        <View style={styles.cancelButton}>
          <Button title="Cancel Edit" onPress={clearForm} />
        </View>
      )}

      <Text style={styles.listTitle}>Student List</Text>

      <FlatList
        data={students}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <Text>No students found. Add a student to begin.</Text>
        }
        renderItem={({item}) => (
          <View style={styles.card}>
            <Text style={styles.studentName}>{item.name}</Text>
            <Text>Age: {item.age}</Text>
            <Text>Course: {item.course}</Text>

            <View style={styles.buttonContainer}>
              <View style={styles.button}>
                <Button
                  title="Edit"
                  onPress={() => editStudent(item)}
                />
              </View>

              <View style={styles.button}>
                <Button
                  title="Delete"
                  color="red"
                  onPress={() => deleteStudent(item.id)}
                />
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  cancelButton: {
    marginTop: 10,
  },
  listTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 25,
    marginBottom: 10,
  },
  card: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  studentName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  button: {
    marginRight: 10,
  },
});

export default App;