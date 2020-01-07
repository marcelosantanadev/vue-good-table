<template>
    <div v-if="!column.hidden && hasFilterRow && isFilterable(column)">
        <input v-if="!isDropdown(column)" type="text" class="vgt-input"
               :placeholder="getPlaceholder(column)"
               :value="columnFilters[column.field]"
               @keyup.enter="updateFiltersOnEnter(column, $event.target.value)"
               @input="updateFiltersOnKeyup(column, $event.target.value)"/>

        <select v-if="isDropdownArray(column)"
                class="vgt-select"
                :value="columnFilters[column.field]"
                @change="updateFilters(column, $event.target.value)">
            <option value="" key="-1">{{ getPlaceholder(column) }}</option>
            <option
                    v-for="(option, i) in column.filterOptions.filterDropdownItems"
                    :key="i"
                    :value="option">
                {{ option }}
            </option>
        </select>

        <select v-if="isDropdownObjects(column)"
                class="vgt-select"
                :value="columnFilters[column.field]"
                @change="updateFilters(column, $event.target.value, true)">
            <option value="" key="-1">{{ getPlaceholder(column) }}</option>
            <option
                    v-for="(option, i) in column.filterOptions.filterDropdownItems"
                    :key="i"
                    :value="option.value">{{ option.text }}
            </option>
        </select>
    </div>
    <div v-else>
        <p style="line-height: 0;">{{column.label}}</p>
    </div>
</template>

<script>
    export default {
        name: 'VgtFilterRow',
        props: [
            'lineNumbers',
            'column',
            'typedColumns',
            'globalSearchEnabled',
            'selectable',
            'mode',
        ],
        watch: {
            column: {
                handler(newValue, oldValue) {
                    this.populateInitialFilters();
                },
                deep: true,
                immediate: true,
            },
        },
        data() {
            return {
                columnFilters: {},
                timer: null,
            };
        },
        computed: {
            hasFilterRow() {
                return !!(this.column.filterOptions && this.column.filterOptions.enabled);
            },
        },
        methods: {
            reset(emitEvent = false) {
                this.columnFilters = {};

                if (emitEvent) {
                    this.$emit('filter-changed', this.columnFilters);
                }
            },

            isFilterable(column) {
                return column.filterOptions
                    && column.filterOptions.enabled;
            },

            isDropdown(column) {
                return this.isFilterable(column)
                    && column.filterOptions.filterDropdownItems
                    && column.filterOptions.filterDropdownItems.length;
            },

            isDropdownObjects(column) {
                return this.isDropdown(column)
                    && typeof column.filterOptions.filterDropdownItems[0] === 'object';
            },

            isDropdownArray(column) {
                return this.isDropdown(column)
                    && typeof column.filterOptions.filterDropdownItems[0] !== 'object';
            },

            getPlaceholder(column) {
                return (this.isFilterable(column) && column.filterOptions.placeholder) || `Filter ${column.label}`;
            },

            updateFiltersOnEnter(column, value) {
                if (this.timer) clearTimeout(this.timer);
                this.updateFiltersImmediately(column, value);
            },

            updateFiltersOnKeyup(column, value) {
                if (column.filterOptions.trigger === 'enter') return;
                this.updateFilters(column, value);
            },

            updateFilters(column, value) {
                if (this.timer) clearTimeout(this.timer);
                this.timer = setTimeout(() => {
                    this.updateFiltersImmediately(column, value);
                }, 400);
            },

            updateFiltersImmediately(column, value) {
                this.$set(this.columnFilters, column.field, value);
                this.$emit('filter-changed', this.columnFilters);
            },

            populateInitialFilters() {
                if (this.isFilterable(this.column)
                    && typeof this.column.filterOptions.filterValue !== 'undefined'
                    && this.column.filterOptions.filterValue !== null) {
                    this.$set(this.columnFilters, this.column.field, this.column.filterOptions.filterValue);
                }

                this.$emit('filter-changed', this.columnFilters);
            },
        },
    };
</script>

<style scoped>

</style>
