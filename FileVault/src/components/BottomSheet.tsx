// File: src/components/BottomSheet.tsx

import React from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Text, IconButton, Divider } from 'react-native-paper';
import { FileOperation } from '@types/index';
import { COLORS } from '@utils/constants';

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onAction: (action: FileOperation) => void;
  selectedCount?: number;
  isSingleFile?: boolean;
}

const actions: { icon: string; label: string; action: FileOperation }[] = [
  { icon: 'eye', label: 'Preview', action: 'open' },
  { icon: 'content-copy', label: 'Copy', action: 'copy' },
  { icon: 'folder-move', label: 'Move', action: 'move' },
  { icon: 'pencil', label: 'Rename', action: 'rename' },
  { icon: 'share-variant', label: 'Share', action: 'share' },
  { icon: 'information-outline', label: 'Info', action: 'info' },
  { icon: 'delete', label: 'Delete', action: 'delete', danger: true },
];

export const BottomSheet: React.FC<BottomSheetProps> = ({
  visible,
  onClose,
  onAction,
  selectedCount = 0,
  isSingleFile = false,
}) => {
  const handleAction = (action: FileOperation) => {
    onAction(action);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.container}>
          <View style={styles.handle} />
          
          <Text variant="titleMedium" style={styles.title}>
            {selectedCount > 0 ? `${selectedCount} item${selectedCount > 1 ? 's' : ''} selected` : 'Actions'}
          </Text>
          
          <Divider />
          
          <ScrollView style={styles.actionsContainer}>
            {actions.map((item) => (
              <TouchableOpacity
                key={item.action}
                style={[
                  styles.actionButton,
                  item.danger && styles.dangerButton,
                  !isSingleFile && item.action === 'open' && styles.disabledButton,
                ]}
                onPress={() => handleAction(item.action)}
                disabled={!isSingleFile && item.action === 'open'}
              >
                <IconButton
                  icon={item.icon}
                  size={24}
                  iconColor={item.danger ? COLORS.error : COLORS.primary}
                />
                <Text
                  variant="bodyMedium"
                  style={[
                    styles.actionLabel,
                    item.danger && { color: COLORS.error },
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text variant="bodyLarge" style={styles.cancelLabel}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.divider,
    borderRadius: 2,
    alignSelf: 'center',
    marginVertical: 16,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  actionsContainer: {
    maxHeight: 300,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  dangerButton: {
    marginTop: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
  actionLabel: {
    marginLeft: 16,
    flex: 1,
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: 16,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  cancelLabel: {
    fontWeight: '600',
    color: COLORS.primary,
  },
});
