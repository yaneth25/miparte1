import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Alert, SafeAreaView, StyleSheet } from 'react-native';
import SidebarMenu from './src/components/SidebarMenu';
import AssignClassScreen from './src/screens/AssignClassScreen';
import ScheduleScreen from './src/screens/ScheduleScreen';
import { COLORS } from './src/constants/theme';
import {
  createClassEntry,
  createRecessEntry,
  updateScheduleEntry,
} from './src/utils/schedule';

export default function App() {
  const [screen, setScreen] = useState('schedule');
  const [classes, setClasses] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const openDrawer = () => setDrawerOpen(true);
  const closeDrawer = () => setDrawerOpen(false);

  const goToSchedule = () => {
    setEditingItem(null);
    setScreen('schedule');
  };

  const goToAssign = (item = null) => {
    setEditingItem(item);
    setScreen('assign');
  };

  const handleFormSubmit = (formData) => {
    if (editingItem) {
      setClasses((prev) =>
        prev.map((entry) =>
          entry.id === editingItem.id
            ? updateScheduleEntry(entry, formData, formData.mode)
            : entry,
        ),
      );
    } else if (formData.mode === 'recess') {
      setClasses((prev) => [
        ...prev,
        createRecessEntry({
          startTime: formData.startTime,
          endTime: formData.endTime,
        }),
      ]);
    } else {
      setClasses((prev) => [...prev, createClassEntry(formData)]);
    }

    goToSchedule();
  };

  const handleDeleteClass = (id) => {
    setClasses((prev) => prev.filter((entry) => entry.id !== id));
  };

  const handleMenuItem = (itemId) => {
    closeDrawer();

    switch (itemId) {
      case 'clases':
        goToSchedule();
        break;
      case 'tareas':
        Alert.alert('Tareas', 'Esta sección será implementada por tu equipo.');
        break;
      case 'notificaciones':
        Alert.alert('Notificaciones', 'Próximamente disponible.');
        break;
      case 'configuracion':
        Alert.alert('Configuración', 'Próximamente disponible.');
        break;
      case 'cerrar':
        Alert.alert('Cerrar sesión', '¿Desea cerrar sesión?', [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Cerrar sesión', style: 'destructive' },
        ]);
        break;
      default:
        break;
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      {screen === 'schedule' ? (
        <ScheduleScreen
          classes={classes}
          onMenuPress={openDrawer}
          onAssignPress={() => goToAssign()}
          onEditClass={(item) => goToAssign(item)}
          onDeleteClass={handleDeleteClass}
        />
      ) : (
        <AssignClassScreen
          editingItem={editingItem}
          onMenuPress={openDrawer}
          onCancel={goToSchedule}
          onSubmit={handleFormSubmit}
        />
      )}

      <SidebarMenu
        visible={drawerOpen}
        onClose={closeDrawer}
        onItemPress={handleMenuItem}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
