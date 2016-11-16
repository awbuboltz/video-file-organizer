(function ($) {
    const extensionsMap = {
        '.zip': 'fa-file-archive-o',
        '.gz': 'fa-file-archive-o',
        '.bz2': 'fa-file-archive-o',
        '.xz': 'fa-file-archive-o',
        '.rar': 'fa-file-archive-o',
        '.tar': 'fa-file-archive-o',
        '.tgz': 'fa-file-archive-o',
        '.tbz2': 'fa-file-archive-o',
        '.z': 'fa-file-archive-o',
        '.7z': 'fa-file-archive-o',
        '.mp3': 'fa-file-audio-o',
        '.cs': 'fa-file-code-o',
        '.c++': 'fa-file-code-o',
        '.cpp': 'fa-file-code-o',
        '.js': 'fa-file-code-o',
        '.xls': 'fa-file-excel-o',
        '.xlsx': 'fa-file-excel-o',
        '.png': 'fa-file-image-o',
        '.jpg': 'fa-file-image-o',
        '.jpeg': 'fa-file-image-o',
        '.gif': 'fa-file-image-o',
        '.mpeg': 'fa-file-movie-o',
        '.pdf': 'fa-file-pdf-o',
        '.ppt': 'fa-file-powerpoint-o',
        '.pptx': 'fa-file-powerpoint-o',
        '.txt': 'fa-file-text-o',
        '.log': 'fa-file-text-o',
        '.doc': 'fa-file-word-o',
        '.docx': 'fa-file-word-o',
    };

    function getFileIcon(ext) {
        return (ext && extensionsMap[ext.toLowerCase()]) || 'fa-file-o';
    }

    let currentPath = null,
        options = {
            bProcessing: true,
            bServerSide: false,
            bPaginate: false,
            bAutoWidth: false,
            sScrollY: '250px',
            fnCreatedRow: (nRow, aData) => {
                if (aData.IsDirectory) {
                    $(nRow).bind('click', e => {
                        goUp(aData.Path);
                        e.preventDefault();
                    });
                }
            },
            aoColumns: [{
                sTitle: '',
                mData: null,
                bSortable: false,
                sClass: 'head0',
                sWidth: '55px',
                render: data => {
                    const href = data.IsDirectory ? '#' : `/${data.Path}`,
                        className = data.IsDirectory ? 'fa fa-folder' : `fa ${getFileIcon(data.Ext)}`;

                    return `<a href="${href}" target="_blank"><i class="${className}"></i>&nbsp;${data.Name}</a>`;
                }
            }]
        };

    const table = $('.linksholder').dataTable(options);

    $.get('/files').then(data => {
        table.fnClearTable();
        table.fnAddData(data);
    });

    $('.up').bind('click', () => {
        if (currentPath) {
            const idx = currentPath.lastIndexOf('\\'),
                path = currentPath.substr(0, idx);

            goUp(path);
        }
    });

    function goUp(path) {
        $.get(`/files?path=${path}`).then(data => {
            table.fnClearTable();
            table.fnAddData(data);
            currentPath = path;
        });
    }
})(jQuery);

