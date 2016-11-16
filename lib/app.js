(function ($) {
    // TODO: map icons to all video extensions
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

    let currentPath = null;

    function navigate(path) {
        $.get(`/files?path=${path}`).then(data => {
            renderData(data);
            currentPath = path;
        });
    }

    function getFileIcon(ext) {
        return (ext && extensionsMap[ext.toLowerCase()]) || 'fa-file-o';
    }

    function renderData(data) {
        let rows = '';

        data.forEach(item => {
            const href = `/${item.path}`,
                isDir = item.isDirectory,
                icon = item.isDirectory ? 'fa fa-folder' : `fa ${getFileIcon(item.ext)}`,
                disabledClass = item.isDirectory ? '' : 'class="disabled" ';

            rows += `<div><i class="${icon}"></i><span ${disabledClass} href="${href}" data-isdir="${isDir}">${item.name}</span></div>`;
        });

        $('#explorer').html(rows).find('span').on('click', (e) => {
            const $a = $(e.target);
            if ($a.data('isdir')) {
                navigate($a.attr('href'));
            }
        });
    }

    $.get('/files').then(renderData);

    $('#btnUp').on('click', () => {
        if (currentPath) {
            const idx = currentPath.lastIndexOf('\\'),
                path = currentPath.substr(0, idx);

            navigate(path);
        }
    });
})(jQuery);

