// import rollup      from 'rollup'
import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs    from 'rollup-plugin-commonjs';
import uglify      from 'rollup-plugin-uglify'


export default {
    entry: 'src/main-aot.js',
    dest: 'dist/build.js', // output a single application bundle
    sourceMap: false,
    format: 'iife',
    onwarn: function (warning) {


        // should intercept ... but doesn't in some rollup versions
        if (warning.code === 'THIS_IS_UNDEFINED') {
            return;
        }

        // console.warn everything else
        console.warn(warning.message);
    },
    plugins: [
       /* babel({
            babelrc: false,
            // exclude: 'node_modules/!**',
            presets: ["es2015-rollup"]
        }),*/
        nodeResolve({jsnext: true, module: true}),
        commonjs({
            include: [ 'node_modules/rxjs/**', 'node_modules/@angular/**','node_modules/primeng/**',],
            namedExports: {
                'node_modules/primeng/primeng.js': [
                    'ConfirmDialogModule',
                    'ConfirmationService',
                    'CheckboxModule',
                    'StepsModule',
                    'MenuModule',
                    'GrowlModule'
                ]
            }
            /*  namedExports:{
             // Add every import you need from primeng to the list
             'node_modules/primeng/primeng.js': [
             'ConfirmationService',
             'SharedModule',
             'PaginatorModule',
             'DataTableModule',
             'TreeModule',
             'ButtonModule',
             'CalendarModule',
             'InputTextModule',
             'TabViewModule',
             'DropdownModule',
             'OverlayPanelModule',
             'MultiSelectModule',
             'DialogModule',
             'PickListModule',
             'ProgressBarModule',
             'MessagesModule',
             'ConfirmDialogModule',
             'CheckboxModule',
             'StepsModule',
             'MenuModule',
             'GrowlModule',
             'SharedModule',
             'PaginatorModule',
             'DataTableModule',
             'TreeModule',
             'ButtonModule',
             'CalendarModule',
             'InputTextModule',
             'TabViewModule',
             'DropdownModule',
             'OverlayPanelModule',
             'MultiSelectModule',
             'DialogModule',
             'PickListModule',
             'ProgressBarModule',
             'MessagesModule',
             'ConfirmDialogModule',
             'CheckboxModule',
             'StepsModule',
             'MenuModule',
             'GrowlModule',
             'ConfirmationService'
             ]
             },*/
        }),
        uglify()
    ]
}
