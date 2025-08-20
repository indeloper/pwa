<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import type { DropdownProps, DropdownItem } from '../../types/dropdown';

const props = withDefaults(defineProps<DropdownProps>(), {
  trigger: 'Menu',
  placement: 'bottom'
});

console.log('Dropdown component loaded');
console.log('Props:', props);
console.log('Items:', props.items);

const isOpen = ref(false);
const triggerRef = ref<HTMLElement>();
const menuStyle = ref({});

const toggleDropdown = () => {
  console.log('toggleDropdown called');
  isOpen.value = !isOpen.value;
  console.log('isOpen is now:', isOpen.value);
  
  if (isOpen.value) {
    // Рассчитываем позицию меню при открытии
    nextTick(() => {
      calculateMenuPosition();
    });
  }
};

const handleItemClick = (item: DropdownItem) => {
  console.log('handleItemClick called with:', item);
  console.log('item.action type:', typeof item.action);
  
  if (!item.disabled) {
    try {
      item.action();
      console.log('Action executed successfully');
    } catch (error) {
      console.error('Error executing action:', error);
    }
    isOpen.value = false;
  } else {
    console.log('Item is disabled');
  }
};

const closeDropdown = () => {
  console.log('closeDropdown called');
  isOpen.value = false;
};

const calculateMenuPosition = () => {
  if (!triggerRef.value) return;
  
  const triggerRect = triggerRef.value.getBoundingClientRect();
  const windowHeight = window.innerHeight;
  const windowWidth = window.innerWidth;
  
  // Оцениваем высоту меню
  const estimatedMenuHeight = props.items.length * 40; // 40px на элемент
  const menuWidth = 200; // примерная ширина меню
  
  let top = triggerRect.bottom + 4; // 4px отступ
  let left = triggerRect.left;
  
  // Проверяем, поместится ли меню снизу
  if (top + estimatedMenuHeight > windowHeight) {
    // Если не помещается снизу, показываем сверху
    top = triggerRect.top - estimatedMenuHeight - 4;
  }
  
  // Проверяем, не выходит ли меню за правую границу
  if (left + menuWidth > windowWidth) {
    left = windowWidth - menuWidth - 10;
  }
  
  // Проверяем, не выходит ли меню за левую границу
  if (left < 10) {
    left = 10;
  }
  
  menuStyle.value = {
    top: `${top}px`,
    left: `${left}px`
  };
};

// Закрываем dropdown при клике вне его
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement;
  if (!target.closest('.dropdown')) {
    isOpen.value = false;
  }
};

// Добавляем обработчик клика по документу

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <div class="dropdown">
    <div 
      ref="triggerRef"
      class="dropdown__trigger" 
      @click="toggleDropdown"
      tabindex="0"
      role="button"
    >
      <slot name="trigger">
        {{ trigger }}
      </slot>
    </div>
    
    <div 
      v-if="isOpen" 
      class="dropdown__menu"
      :style="menuStyle"
    >
      <div 
        v-for="item in items" 
        :key="item.label"
        class="dropdown__item"
        :class="{ 'dropdown__item--disabled': item.disabled }"
        @click="handleItemClick(item)"
      >
        <div class="dropdown__label">{{ item.label }}</div>
        <div v-if="item.description" class="dropdown__description">
          {{ item.description }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Component-specific styles can be added here if needed */
</style>