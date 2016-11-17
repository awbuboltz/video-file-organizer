(function ($) {
    let currentPath = '/';

    $.get('/files').then(renderData);

    function navigate(path) {
        $.get(`/files?path=${path}`).then(data => {
            renderData(data);
            currentPath = path;
        });
    }

    function getFileIcon(ext) {
        const extensionsMap = {
            'fa-file-archive-o': ['.zip', '.gz', '.bz2', '.xz','.rar', '.tar', '.tgz', '.tbz2', '.z', '.7z'],
            'fa-file-audio-o': ['.mp3'],
            'fa-file-code-o': ['.cs', '.c++', '.cpp', '.js'],
            'fa-file-excel-o': ['.xls', '.xlsx'],
            'fa-file-image-o': ['.png', '.jpg', '.jpeg', '.gif'],
            'fa-file-movie-o': ['.mpeg', '.avi', '.flv', '.divx', '.m4v', '.mkv', '.mp4', '.wmv'],
            'fa-file-pdf-o': ['.pdf'],
            'fa-file-powerpoint-o': ['.ppt', '.pptx'],
            'fa-file-text-o': ['.txt', '.log'],
            'fa-file-word-o': ['.doc', '.docx']
        };

        let icon = 'fa-file-o';

        if (ext) {
            ext = ext.toLowerCase();

            for (let extName in extensionsMap) {
                if (extensionsMap[extName].indexOf(ext) > -1) {
                    icon = extName;
                    break;
                }
            }
        }

        return icon;
    }

    function renderData(data) {
        let rows = '';

        data.forEach(item => {
            const href = `/${item.path}`,
                isDir = item.isDirectory,
                icon = item.isDirectory ? 'fa fa-folder' : `fa ${getFileIcon(item.ext)}`,
                disabledClass = item.isDirectory ? '' : 'class="disabled" ';

            rows += `<div><i class="${icon}"></i><span ${disabledClass} data-href="${href}" data-isdir="${isDir}">${item.name}</span></div>`;
        });

        $('#explorer').html(rows).find('span').on('click', (e) => {
            const $a = $(e.target);
            if ($a.data('isdir')) {
                navigate($a.data('href'));
            }
        });
    }

    $('#btnUp').on('click', () => {
        if (currentPath) {
            const idx = currentPath.lastIndexOf('\\'),
                path = currentPath.substr(0, idx);

            navigate(path);
        }
    });

    $('#btnFilterShows').on('click', () => {
        $.get(`/filter?path=${currentPath}`).then(data => {
            renderData(data);
        });
    });
})(jQuery);

