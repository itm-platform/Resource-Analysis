/* jshint smarttabs: true, forin: false, browser:true, devel:true, jquery:true */
/* global TeamCtrl */
//=============================================================================
//						       teamctrl.js
/**!
* @license      Copyright 2013 - IT Governance and Management, S.L.
* @fileoverview TeamCtrl.js include teamctrl class and utilities
* @author       IT Governance and Management, S.L.
* @version      1.2.11
*/
//=============================================================================
//=============================================================================
// Class:	teamctrl
/**
* TeamCtrl is a class for generate and to manage Project Team on ITM Platform
* @example
* var oCtrl = new teamctrl({element: 'div_id', lang: 'en', culture: 'en-us'});
* @class teamctrl
* @param {Object} oConfig	Object with settings
* @param {Function} fEndCallback	Callback when the control is created
*/
//=============================================================================
function ResourceManagement(oConfig, fEndCallback) {

    "use strict";
  


    //=================================================
    // PRIVATE properties and methods
    //=================================================

    /**
    * Reference name of this class
    * @type {string}
    */
    var NAME = 'teamctrl';

    /**
    * Reference name of this class
    * @type {string}
    */
    var VERSION = '1.2.11';

    /**
    * Object setting
    * @type {Object}
    */
    var settings = null;

    //=============================================================================
    //									 UTILS
    //=============================================================================
    //=============================================================================
    // Object:		utils (static)
    // Scope:		private into TeamCtrl
    /**
    * Utils of TeamCtrl
    * @class
    */
    //=============================================================================
    var utils = {

        //-------------------------------------------------
        // Utils - PATH parameter
        //-------------------------------------------------		

        /**
        * Base path
        * @return {string}
        */
        PATH: (function () {
            var cJavascriptFile = $('script[src*=' + NAME + ']').attr('src');
            return cJavascriptFile ? cJavascriptFile.substring(0, cJavascriptFile.lastIndexOf('/') + 1) : '.';
        }()),

        //-------------------------------------------------
        // Utils - Debug functions
        //-------------------------------------------------		

        /**
        * Content the last error message
        * @return {string}
        */
        LastError: null,

        /**
        * Show a message into browser console for debug proposal
        * @param {string} cText text to show
        */
        DebugWarning: function (cText) { },
        /* End of DebugWarning() */

        /**
        * Show a error message into browser console for debug proposal
        * @param {string} cText text to show
        */
        DebugError: function (cText) {
            if (typeof console !== 'undefined' && console !== null) {
                console.error('ERROR: ' + cText);
            }
            utils.LastError = cText;
        },
        /* End of DebugError() */


        //-------------------------------------------------
        // Utils - Each function
        //-------------------------------------------------		

        /**
        * Call fCallback for each element of the array sorted and filter
        * @param {Array} aArray	Array
        * @param {Function}	fCallback	Callback function
        * @param {String} opt_cPropSort	Sort by this member
        * @param {Function}	opt_fFilter	Filter function, receive the record as parameter and return true or false.
        * @param {Function}	opt_fSort	Sort function.
        */
        Each: function (aArray, fCallback, opt_cPropSort, opt_fFilter, opt_fSort) {
            var aKey = [];
            var cKey = '';
            var aArrayCopy = $.extend(true, [], aArray);
            for (cKey in aArrayCopy) {
                if (!aArrayCopy.hasOwnProperty(cKey)) {
                    continue;
                }
                if (opt_fFilter) {
                    if (opt_fFilter(cKey, aArrayCopy[cKey])) {
                        aKey.push(opt_cPropSort ? aArrayCopy[cKey][opt_cPropSort] + '-' + cKey : cKey);
                    }
                } else {
                    aKey.push(opt_cPropSort ? aArrayCopy[cKey][opt_cPropSort] + '-' + cKey : cKey);
                }
            }
            if (opt_fSort) {
                aKey.sort(opt_fSort);
            } else {
                aKey.sort();
            }
            for (var nCont = 0, nMax = aKey.length; nCont < nMax; nCont++) {
                for (cKey in aArrayCopy) {
                    if (!aArrayCopy.hasOwnProperty(cKey)) {
                        continue;
                    }
                    if (opt_cPropSort ? (aArrayCopy[cKey][opt_cPropSort] + '-' + cKey === aKey[nCont]) : cKey === aKey[nCont]) {
                        fCallback(cKey, aArrayCopy[cKey]);
                        break;
                    }
                }
            }
        },
        /* End of Each() */

        //-------------------------------------------------
        // Utils - CSS functions
        //-------------------------------------------------		

        /**
        * Check if a CSS file is loaded, and load it if is necessary
        * @param {String} cFile	Filename of CCS
        * @return {boolean}	true if is loaded previously
        */
        checkCSS: function (cFile) {
            //!			var aResult = $('link[rel=stylesheet]');
            //!			for (var nCont = 0, nMax = aResult.length; nCont < nMax; nCont++) {
            //!				if ($(aResult[nCont]).attr('href').indexOf(cFile) > -1) {
            //!					return true;
            //!				}
            //!			}
            //            if ($('link[rel=stylesheet][href*=' + cFile.replace('.', '\\.') + ']').length) {
            //                return true;
            //            }
            //            $('head').append('<link type="text/css" rel="stylesheet" href="' + this.PATH + cFile + '" />');
            return false;
        },
        /* End of checkCSS() */


        //-------------------------------------------------
        // Utils - Culture and translation functions
        //-------------------------------------------------		

        /**
        * Associative array with culture options for Date format
        */
        culture: {
            'es-es': {
                nameJQueryUI: 'es',
                shortDate: 'd/m/Y',
                shortDateFormat: 'dd/mm/yy'
            },
            'en-us': {
                nameJQueryUI: '',
                shortDate: 'm/d/Y',
                shortDateFormat: 'mm/dd/yy'
            },
            'en-gb': {
                nameJQueryUI: 'en-GB',
                shortDate: 'd/m/Y',
                shortDateFormat: 'dd/mm/yy'
            },
            'pt-br': {
                nameJQueryUI: 'pt-BR',
                shortDate: 'd/m/Y',
                shortDateFormat: 'dd/mm/yy'
            }
        },
        /* End of culture */

        /**
        * return translation of literals
        * @function
        * @return {function}
        */
        T: (function () {
            // All special characters must be written as hexadecimal codes: \xF1
            var aTexts = {
                'Employee': {
                    'es': 'Empleado',
                    'pt': 'Empregado'
                },
                'You have unsaved data. Are you sure you want to leave this page?': {
                    'es': 'Tiene datos sin grabar Â¿EstÃ¡ seguro de querer abandonar la pÃ¡gina?',
                    'pt': 'Voc\xEA est\xE1 saindo desta p\xE1gina sem salvar os dados e estas informa\xE7\xF5es ser\xE3o perdidas.'
                },
                'Cancel': {
                    'es': 'Cancelar',
                    'pt': 'Cancelar'
                },
                'rounded': {
                    'es': 'redondeado',
                    'pt': 'arredondado'
                },
                'Projects &amp; Services': {
                    'es': 'Proyectos y Servicios',
                    'pt': 'Projetos e Servi\xE7os'
                },
                'TOTAL DEMAND': {
                    'es': 'DEMANDA TOTAL',
                    'pt': 'DEMANDA TOTAL'
                },
                'TOTAL ALLOCATED': {
                    'es': 'TOTAL ASIGNADO',
                    'pt': 'TOTAL ATRUBU\xCDDO'
                },
                'TOTAL GAP': {
                    'es': 'DESVIACI\xD3N TOTAL',
                    'pt': 'DESVIO TOTAL'
                },
                'Available categories': {
                    'es': 'Perfiles profesionales disponibles',
                    'pt': 'Perfis profissionais'
                },
                'External': {
                    'es': 'Externo',
                    'pt': 'Externo'
                },

                'General': {
                    'es': 'General',
                    'pt': 'Geral'
                },
                'Internal': {
                    'es': 'Interno',
                    'pt': 'Interno'
                },
                'Save': {
                    'es': 'Guardar',
                    'pt': 'Salvar'
                },
                'Professional categories/Users': {
                    'es': 'Perfiles profesionales/Usuarios',
                    'pt': 'Profissionais profiles / User'
                },
                'Capacity': {
                    'es': 'Capacidad',
                    'pt': 'Capacidade'
                },
                'Allocated': {
                    'es': 'Asignado',
                    'pt': 'Atribu\xEDdo'
                },
                'Demand': {
                    'es': 'Demanda',
                    'pt': 'Demanda'
                },
                'Gap': {
                    'es': 'Desviaci\xF3n',
                    'pt': 'Desvio'
                },
                'When changing values for the interval of week, month or quarter, your manual day entries will be overwritten. Do you want to continue?': {
                    'es': 'Al cambiar los valores en los intervalos de semana, mes o trimestre, los cambios que se hubieran hecho anteriormente se sobreescribir\xE1n. Â¿Desea continuar?',
                    'pt': 'Ao alterar os valores nos intervalos de semana / m\xEAs / trimestre, as altera\xE7\xF5es manuais ser\xE3o substitu\xEDdas. Voc\xEA deseja continuar?'
                },
                'Demand cannot be less than the allocated capacity.': {
                    'es': 'La demanda debe ser mayor a la capacidad asignada',
                    'pt': 'A demanda deve ser maior do que a capacidade designada'
                },
                'to': {
                    'es': 'hasta',
                    'pt': 'para'
                },
                'Allocated value can not exceed then the demand': {
                    'es': 'El valor asignado no puede exceder la demanda',
                    'pt': 'O valor atribu\xEDdo n\xE3o pode exceder a demanda'
                },
                'Add resources to project': {
                    'es': 'A\xF1adir recursos al proyecto',
                    'pt': 'Adicionar recursos para o projeto'
                },
                'Add resources to task': {
                    'es': 'A\xF1adir recursos a la tarea',
                    'pt': 'Adicionar recursos \xE0 tarefa'
                },
                'Edit task': {
                    'es': 'Editar tarea',
                    'pt': 'Editar tarefa'
                },
                'If you do not save your changes first they will be lost when changing the period. Do you want to continue?': {
                    'es': 'Si no guarda sus cambios antes, se perder\xE1n cuando cambia el periodo. Â¿Desea continuar?',
                    'pt': 'Se voc\xEA n\xE3o salvar suas altera\xE7\xF5es antes, as mesmas se perder\xE3o quando o per\xEDodo mudar. Quer continuar?'
                },
                'Please specify a number of intervals': {
                    'es': 'Por favor introduzca un n\xFAmero de intervalos',
                    'pt': 'Por favor, indique um intervalo de n\xFAmero'
                },
                'Please fill in a the percentage for marking the underallocation': {
                    'es': 'Por favor introduzca un porcentaje para destacar la subasignaci\xF3n',
                    'pt': 'Por favor insira uma porcentagem para destacar o sub-aloca\xE7\xE3o'
                },
                'There is nothing to cancel since you have not made any changes': {
                    'es': 'No se puede cancelar nada porque no ha aplicado cambios',
                    'pt': 'Voc\xEA n\xE3o pode cancelar nada porque voc\xEA n\xE3o tem mudan\xE7as'
                },
                'Crunching the numbers': {
                    'es': 'Calculando las cifras',
                    'pt': 'Calculando os n\xFAmeros'
                },
                'Are you sure you want to cancel the changes you made?': {
                    'es': 'Â¿Est\xE1 seguro de que quiere cancelar los cambios que ha hecho?',
                    'pt': 'Tem certeza de que deseja cancelar as altera\xE7\xF5es feitas?'
                },
                'Availablity': {
                    'es': 'Disponible',
                    'pt': 'Dispon\xEDvel'
                },
                'There is nothing to show here.<br />Start assigning hours to the project team members.': {
                    'es': 'No hay nada que mostrar aqu\xED.<br />Asigne horas a los miembros de los proyectos para comenzar.',
                    'pt': 'There is nothing to show here.<br />Start assigning hours to the project team members.'
                },
                'Start date should be less than end date': {
                    'es': 'La fecha de inicio debe ser anterior a la fecha de fin',
                    'pt': 'A data de fim deve ser superior Ã  data de inÃ­cio'
                }
            };
            var aCache = null;
            return function _T(cText) {
                if (!aCache) {
                    aCache = [];
                    for (var cKey in aTexts) {
                        if (!aTexts.hasOwnProperty(cKey)) {
                            continue;
                        }
                        aCache[cKey] = aTexts[cKey][settings.lang] ? aTexts[cKey][settings.lang] : cKey;
                    }
                }
                if (aCache[cText] === undefined) {
                    return cText;
                }
                return aCache[cText];
            };
        })()
        /* End of T() */


    };
    //=================================================
    // End of Utils
    //=================================================

    //=============================================================================
    //									 VIEW
    //=============================================================================
    //=============================================================================
    // Object:		utils (static)
    // Scope:		private into TeamCtrl
    /**
    * Utils of TeamCtrl
    * @class
    */
    //=============================================================================
    var view = (function () {

        //---------------------------------
        // PRIVATE variables and functions
        //---------------------------------

        // Constant
        var COLUMNWIDTH = 166;

        // Variables
        var $root = null,
            $project = null,
            $projectHeader = null,
            $projectSubHeader = null,
            $projectBody = null,
            $projectHeaderLeft = null,
            $projectHeaderRight = null,
            $projectHeaderIntervals = null,
            $projectSubHeaderLeft = null,
            $projectSubHeaderRight = null,
            $projectBodyLeft = null,
            $projectBodyRight = null,
            $projectHeaderRightContent = null,
            $projectBodyRightContent = null,
            $projectSubHeaderRightContent = null,
            $projectScroll = null,
            $projectScrollLeft = null,
            $projectScrollRight = null,
            $projectScrollRightContent = null,
            $user = null,
            $userHeader = null,
            $userBody = null,
            $userHeaderLeft = null,
            $userHeaderRight = null,
            $userHeaderIntervals = null,
            $userSubHeaderLeft = null,
            $userSubHeaderRight = null,
            $userBodyLeft = null,
            $userBodyRight = null,
            $userHeaderRightContent = null,
            $userBodyRightContent = null,
            $addResourcePopup = null,
            $addCategoryPopup = null,
            $userScroll = null,
            $userScrollLeft = null,
            $userScrollRight = null,
            $userScrollRightContent = null,
            totalDemand = 0,
            totalAllocated = 0,
            scrollWidth = 0,
            projectId = 0,
            parentTaskId = 0,
            taskId = 0,
            selectedCategoriesWithType = '',
            categoryData = {},
            selectedUsers = {},
            taskData = {},
            projectData = {},
            parentTaskData = {},
            popupTasks = [];

        var aImages = {};

        /**
        * Obtain a reference to JQuery on window.top and to initialize the dialog element
        */
        var jQueryUIReference = (function () {
            var $j = null;
            return function () {

                // Get reference to jQuery on window.top
                if (!$j) {
                    if (window.top.jQuery === undefined) {
                        $j = $;
                    } else {
                        $j = window.top.jQuery;
                    }

                    // Check if jQuery on window.top has support for jQueryUI
                    if (!$j(document).dialog) {
                        $j = $;
                    }

                    // Configure jQuery UI style
                    var $check = $j('<p class="ui-widget ui-widget-overlay"></p>').hide().appendTo(window.top.document.body);
                    if ($check.css('font-size') !== '11px') {
                        $j('<style>\n' +
                            '.ui-widget {\n' +
                            '	font-size: 11px !important;\n' +
                            '}\n' +
                            '</style>\n').appendTo($(window.top.document).find('head'));
                    }
                    if ($check.css('background-image').substring(0, 45) !== 'url(data:image/png;base64,iVBORw0KGgoAAAANSUh') {
                        $j('<style>\n' +
                            '.ui-widget-overlay {\n' +
                            '	background: #666666 url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQIHWNgkAIAAB0AG40k5n0AAAAASUVORK5CYII=) 50% 50% repeat !important;\n' +
                            '	opacity: .50;\n' +
                            '	filter:Alpha(Opacity=50);\n' +
                            '}\n' +
                            '</style>\n').appendTo($(window.top.document).find('head'));
                    }
                    $check.remove();
                }
                return $j;
            };
        })();
        /* End of jQueryUIReference() */

        function bindIntervals() {
            var intervalFromVal = '',
                intervalToVal = new Date(),
                intervalVal = '';
            if (model.data.Intervals != null && model.data.Intervals.length > 0) {
                $.each(model.data.Intervals, function (i, interval) {
                    intervalFromVal = new Date(interval.IntervalName).format(dateFormat());
                    intervalVal = intervalFromVal;
                    if ($("#drpIntervals").val() != "1") {
                        if ((i + 1) == model.data.Intervals.length) {
                            if ($("#drpIntervals").val() == "2") {
                                intervalToVal = new Date(interval.IntervalName);
                                intervalToVal = intervalToVal.addDays(6);
                            }
                            else if ($("#drpIntervals").val() == "3") {
                                intervalToVal = new Date(interval.IntervalName);
                                intervalToVal = intervalToVal.addDays(30);
                            }
                            else if ($("#drpIntervals").val() == "4") {
                                intervalToVal = new Date(interval.IntervalName);
                                intervalToVal = intervalToVal.addDays(90);
                            }
                        }
                        else {
                            if ($("#drpIntervals").val() == "2") {
                                intervalToVal = new Date(model.data.Intervals[i + 1].IntervalName);
                            }
                            else if ($("#drpIntervals").val() == "3") {
                                intervalToVal = new Date(model.data.Intervals[i + 1].IntervalName);
                            }
                            else if ($("#drpIntervals").val() == "4") {
                                intervalToVal = new Date(model.data.Intervals[i + 1].IntervalName);
                            }
                            intervalToVal = intervalToVal.addDays(-1);
                        }

                        intervalVal = intervalFromVal + " " + utils.T('to') + " " + intervalToVal.format(dateFormat());
                    }

                    var styleOverride = "style= \"margin: auto; float: none\" ";
                    if (settings.allocated.visible && settings.gap.visible) {
                        styleOverride = "";
                    }
                    var titleBarProjectHeader = '<div class="r-month">' +
                        '<h3>' + intervalVal + '</h3>' +
                        '<div class="r-title" ' + styleOverride + ' title="' + utils.T('Demand') + '">' + utils.T('Demand') + '</div>';
                    if (settings.allocated.visible) {
                        titleBarProjectHeader += '<div class="r-title" title="' + utils.T('Allocated') + '">' + utils.T('Allocated') + '</div>';
                    }
                    if (settings.allocated.visible) {
                        titleBarProjectHeader += '<div class="r-title" title="' + utils.T('Gap') + '">' + utils.T('Gap') + '</div>';
                    }
                    titleBarProjectHeader += '</div>';
                    $(titleBarProjectHeader).appendTo($projectHeaderRightContent);

                    var titleBarUserHeader = '<div class="r-month">' +
                        '<h3>' + intervalVal + '</h3>' +
                        '<div class="r-title" title="' + utils.T('Capacity') + '">' + utils.T('Capacity') + '</div>';
                    if (settings.allocated.visible) {
                        titleBarUserHeader += '<div class="r-title" title="' + utils.T('Allocated') + '">' + utils.T('Allocated') + '</div>';
                    }
                    if (settings.gap.visible) {
                        titleBarUserHeader += '<div class="r-title" title="' + utils.T('Availablity') + '">' + utils.T('Availablity') + '</div>';
                    }
                    titleBarUserHeader += '</div>';
                    $(titleBarUserHeader).appendTo($userHeaderRightContent);

                    $(getProgressBar(interval.IntervalIdentity)).appendTo($projectSubHeaderRightContent);
                });
            }
        }

        function calculateFinalTotal() {
            var totalDemand = 0.00;
            $("input[datamembertype='category-demand'][rowtype='category-row']").each(function () {
                totalDemand += getNumberFromString($(this).val());
            })
            $("#spnTotalDemand").html(setHoursFormat(totalDemand) + "H");
            var totalAllocated = 0.00;
            $("input[datamembertype='category-allocated'][rowtype='category-row']").each(function () {
                totalAllocated += getNumberFromString($(this).val());
            })
            $("#spnTotalAllocated").html(setHoursFormat(totalAllocated) + "H");
            var totalGap = totalDemand - totalAllocated;
            $("#spnTotalGap").html(setHoursFormat(totalGap) + "H");
            var percentage = Math.round(totalDemand, 0) != 0 ? Math.round((totalAllocated * 100) / totalDemand, 0) : 0;
            if (percentage > 100) {
                percentage = 100;
            }
            $("#tdTotalValue").html(percentage + '%');
            var intervalsHeader = model.getData().Intervals;

            if (intervalsHeader != null && intervalsHeader.length > 0) {
                $.each(intervalsHeader, function (index, value) {
                    totalDemand = 0.00;
                    $("input[datamembertype='category-demand'][rowtype='category-row'][intervalidentity='" + value.IntervalIdentity + "']").each(function () {
                        totalDemand += getNumberFromString($(this).val());
                    })

                    totalAllocated = 0.00;
                    $("input[datamembertype='category-allocated'][rowtype='category-row'][intervalidentity='" + value.IntervalIdentity + "']").each(function () {
                        totalAllocated += getNumberFromString($(this).val());
                    })

                    percentage = Math.round(totalDemand, 0) != 0 ? Math.round((totalAllocated * 100) / totalDemand, 0) : 0;
                    if (percentage > 100) {
                        percentage = 100;
                    }
                    if (percentage < 0) {
                        percentage = 0;
                    }
                    setProgress("Span_remainingSubmissions_" + value.IntervalIdentity, percentage, "divremainingSubmissionsPanelBody_" + value.IntervalIdentity);

                });
            }
        }

        function setProgress(spanIdid, newValue, divCircleid) {
            var oldValue = $('#' + spanIdid).text();
            var removeClassName = "progress-" + oldValue;
            var addClassName = "progress-" + newValue;
            $('#' + divCircleid).removeClass(removeClassName);
            $('#' + divCircleid).addClass(addClassName);
            $('#' + spanIdid).html(newValue);
        }

        function bindProjects() {
            var projectMethodTypeImage = "",
                strSetting = '';
            if (model.data.Projects != null && model.data.Projects.length > 0) {
                $.each(model.data.Projects, function (i, project) {

                    if (i > 0 && i % 5 == 0) {
                        window.setTimeout(function () {
                            $("#divShowMore").hide();
                            $(".trHide").show();
                            $("#divResourceManagement").show();
                        }, 10);

                        //break;
                    }

                    if (project.ProjectMethodType == 1) {
                        projectMethodTypeImage = "../images/Waterfall.svg";
                    } else {
                        projectMethodTypeImage = "../images/Agile.svg";
                    }
                    strSetting = '<a href="#"  projectid="' + project.ProjectId + '" class="rem-rowlink rem-setting" data-popup="project" title="' + utils.T('Add resources to project') + '"><img src="../ResourceManagementControl/images/cogwheel.svg" alt="" width="16px" height="16px"/></a>';
                    $('<div class="rem-row row1" id="project_' + project.ProjectId + '" datatype="project"><img src="../ResourceManagementControl/images/ar-small-close.png" class="arrowUpImage" isHidden="true" datatype="project" data-row-class="row1"/>  <img src="' + projectMethodTypeImage + '" alt="" class="imgProjectMethodType" data-projectmethodtype="' + project.ProjectMethodType + '"> <span class="spnProjectName"><a href="' + project.RedirectURL + '" target="_blank">' + project.ProjectName + '</a></span>' + strSetting + '</div>').appendTo($projectBodyLeft);

                    bindIntervalValues(1, project, null, "project_" + project.ProjectId, false);

                    if (project.Tasks != null && project.Tasks.length > 0) {
                        var tasks = $.grep(project.Tasks, function (e) {
                            return e.TaskKind == 2 || (e.TaskKind == 3 && e.ParentTaskId == 0)
                        });

                        if (tasks.length > 0) {
                            $.each(tasks, function (j, task) {

                                if (task.TaskKind == 2 || (task.TaskKind == 3 && task.Categories != undefined)) {
                                    bindTask(task, project.ProjectId, project);
                                }

                                if (task.TaskKind == 2) {
                                    var childTasks = $.grep(project.Tasks, function (e) {
                                        return e.ParentTaskId == task.TaskId
                                    });
                                    if (childTasks.length > 0) {
                                        $.each(childTasks, function (k, ctask) {
                                            if (ctask.TaskKind == 3 && ctask.Categories != undefined) {
                                                bindTask(ctask, project.ProjectId, project);
                                            }
                                        });
                                    }
                                }
                            });
                        }
                    }
                });

                $("#spnTotalDemand").text(totalDemand + ":00h");
                $("#spnTotalAllocated").text(totalAllocated + ":00h");
                $("#spnTotalGap").text((totalDemand - totalAllocated) + ":00h");
            }
        }

        function bindProjectCategories() {
            var projectMethodTypeImage = "",
                strSetting = '';
            if (typeof model.data.Project !== 'undefined' && model.data.Project.Categories != null && model.data.Project.Categories.length > 0) {
                updateCategoriesData(model.data.Project.Categories).done(function () {
                    $.each(model.data.Project.Categories, function (i, category) {
                        bindCategory(category, undefined, undefined, 0);
                        // Temporal, check that only the project lines are visible now
                        $(".rem-row").show();
                    });
                });

                $("#spnTotalDemand").text(totalDemand + ":00h");
                $("#spnTotalAllocated").text(totalAllocated + ":00h");
                $("#spnTotalGap").text((totalDemand - totalAllocated) + ":00h");
            }
        }

        function updateCategoriesData(categories) {
            var apiUrl = 'v2/' + companyId + '/Categories';
            var url = apiBaseURL + apiUrl;

            var defer = $.Deferred();
            $.ajax({
                url: url,
                headers: { "token": userLoginToken },
                dataType: "json",
                type: "get",
                beforeSend: function () {
                    $(".divLoader").show();
                },
                complete: function () {
                    $(".divLoader").hide();
                },
                contentType: "application/json; charset=utf-8",
                async: false,
                success: function (responseCategories) {
                    var categoryMap = {};
                    $.each(responseCategories, function (i, category) {
                        categoryMap[category.Id] = category;
                    });
                    var minStartDate = model.data.Intervals[0].StartDate;
                    var maxEndDate = model.data.Intervals[model.data.Intervals.length - 1].EndDate; 
                    $.each(categories, function (i, category) {
                        category.CategoryName = (categoryMap[category.CategoryId] != undefined) ? categoryMap[category.CategoryId].Name : "";
                        // Temporal!
                        category.TaskStartDate = minStartDate;
                        category.TaskEndDate = maxEndDate;
                    });
                    defer.resolve(responseCategories);
                },
                error: function (response) {
                    displayAPIError(response.responseText);
                }
            });

            return defer.promise();
        }

        function bindTask(task, pid, project) {
            var cls = "row2",
                id = "project_" + pid + "_task_" + task.TaskId,
                dataType = "task",
                strSetting = '';
            if (task.TaskKind == 3) {
                strSetting = '<a href="#"  taskid="' + task.TaskId + '" projectid="' + pid + '" parenttaskid="' + task.ParentTaskId + '" class="rem-rowlink rem-setting"  data-popup="task" title="' + utils.T('Edit task') + '"><img src="../ResourceManagementControl/images/cogwheel.svg" alt="" width="16px" height="16px"/></a>'
                if (task.ParentTaskId != 0) {
                    id = "project_" + pid + "_parenttask_" + task.ParentTaskId + "_task_" + task.TaskId;
                    cls = "row3";
                    dataType = "innertask";
                }
            } else if (task.TaskKind == 2) {
                id = "project_" + pid + "_parenttask_" + task.TaskId;
                dataType = "parenttask";
            }
            $('<div class="rem-row ' + cls + '" id=' + id + ' datatype="' + dataType + '" style="display:none"><img src="../ResourceManagementControl/images/ar-small.png" class="arrowUpImage" isHidden="false" datatype="project" data-row-class="' + cls + '"/><span class="spnTaskName" title="' + task.TaskName + '"><a href="' + task.RedirectURL + '" target="_blank">' + (task.TaskKind == 2 ? '<strong>' : '') + task.TaskName + (task.TaskKind == 2 ? '</strong>' : '') + '</a></span>' + strSetting + ' </div>').appendTo($projectBodyLeft);

            if (task.TaskKind == 2) {
                bindIntervalValues(2, project, task.TaskId, id, false);
            } else {
                if (task.ParentTaskId != 0) {
                    bindIntervalValues(5, task, task.TaskId, id, false);
                } else {
                    bindIntervalValues(3, task, task.TaskId, id, false);
                }
            }

            if (task.Categories != undefined && task.Categories.length > 0) {
                $.each(task.Categories, function (i, category) {
                    bindCategory(category, pid, task.TaskId, task.ParentTaskId);
                });
            }


        }

        function openTaskPopup(taskId, strRedirectURL) {
            var oTask = {},
                oTaskCheck,
                isGetTasks = true;
            selectedUsers = '';
            projectData = {};
            projectData.ProjectId = projectId;
            projectData.ProjectName = $("#project_" + projectId + " .spnProjectName a").text();
            projectData.RedirectURL = $("#project_" + projectId + " .spnProjectName a").attr("href");
            projectData.ProjectMethodType = parseInt($("#project_" + projectId + " .imgProjectMethodType").attr("data-projectmethodtype"));

            $("#btnAddResources").attr("projectid", projectId);
            $("#divAddResource").find(".rem-close").attr("data-popup", "task-resources");
            if (parentTaskId > 0) {
                parentTaskData = {};
                parentTaskData.TaskId = parentTaskId;
                parentTaskData.TaskName = $("#project_" + projectId + "_parenttask_" + parentTaskId + " .spnTaskName:eq(0) a").text();
            }

            if (popupTasks.length > 0) {
                oTaskCheck = $.grep(popupTasks, function (e) {
                    return e.TaskId == taskId
                });
                if (oTaskCheck.length > 0) {
                    oTask = oTaskCheck[0];
                    isGetTasks = false;
                    taskData = JSON.parse(JSON.stringify(oTask));
                    setTaskDetailsInPopup(oTask);
                }
            }

            if (isGetTasks) {
                $.ajax({
                    type: "POST",
                    url: settings.URLTaskDetails,
                    data: JSON.stringify({
                        intTaskId: taskId
                    }),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (msg) {

                        try {
                            var objJson = JSON.parse(msg.d)[0];

                            taskData = JSON.parse(JSON.stringify(objJson));
                            taskData.RedirectURL = strRedirectURL;

                            if (objJson.TaskId > 0) {

                                oTask = {};
                                oTask = JSON.parse(JSON.stringify(taskData));
                                oTask.oldTaskName = oTask.TaskName;


                                if (popupTasks.length > 0) {
                                    oTaskCheck = $.grep(popupTasks, function (e) {
                                        return e.TaskId == objJson.TaskId
                                    });
                                    if (oTaskCheck.length > 0) {
                                        oTask = oTaskCheck[0];
                                    } else {
                                        popupTasks.push(oTask);
                                    }
                                } else {
                                    popupTasks.push(oTask);
                                }
                                setTaskDetailsInPopup(oTask);
                                oTask.TaskStartDate = $("#txtStartDate").val();
                                oTask.TaskEndDate = $("#txtEndDate").val();
                                oTask.oldStartDate = $("#txtStartDate").val();
                                oTask.oldEndDate = $("#txtEndDate").val();

                                $("#hdnStartDate").val(oTask.oldStartDate);
                                $("#hdnEndDate").val(oTask.oldEndDate);
                            }
                        } catch (ex) {
                            //Some issue occurred while fetching task details.
                        }
                    }
                });
            }

        }

        function setTaskDetailsInPopup(oTask) {

            var dp = setDateFormat(false);

            //$(".rem-overlay, #divTaskDetails").fadeIn();
            $("#modelForTask").modal("show");
            $("#txtTaskName").val(oTask.TaskName);
            $("#hdnTaskName").val(oTask.oldTaskName);
            $("#pTaskId").html(oTask.TaskNo);
            $("#pStatus").html(oTask.TaskStatus);
            $("#pType").html(oTask.TaskType);
            //$("#txtStartDate").val(oTask.TaskStartDate);
            //$("#txtEndDate").val(oTask.TaskEndDate);
            $("#modelForTask .datepicker-input").datepicker({
                todayHighlight: true,
                autoclose: true,
                format: setDateFormat(false),
                weekStart: FirstDayOfWeek
            });
            
            $("#txtStartDate").datepicker("update", oTask.TaskStartDate);
            $("#txtEndDate").datepicker("update", oTask.TaskEndDate);

            $("#hdnStartDate").val(oTask.oldStartDate);
            $("#hdnEndDate").val(oTask.oldTaskName);
        }

        function openCategoryPopup() {
            $.ajax({
                type: "GET",
                url: settings.URLGetCategories,
                data: "",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (msg) {
                    try {
                        var objjJSON = JSON.parse(msg.d);
                        categoryData = JSON.parse(JSON.stringify(objjJSON.Categories));
                        var $divAddCategoryBody = $("#divAddCategoryBody");
                        var html = "<div style='height:auto;max-height:205px;overflow-y: hidden;'><table cellpadding='3' width='100%'>";
                        html += '<tr class="gridheaderbg"><td align="left" colspan="8" style="font-family: Arial; font-weight: normal;padding-bottom:8px;font-weight:bold">' + utils.T('Available categories') + '</td></tr>';
                        for (var i = 0; i < objjJSON.Categories.length; i++) {
                            html += '<tr>'
                            html += '<td><input type="checkbox" style="position:relative; top:-1px" name="categories" id="chk_category_' + objjJSON.Categories[i].CategoryId + '"></td>'
                            html += '<td style="width:120px;">' + objjJSON.Categories[i].CategoryName + '</td>'
                            html += '<td align=""><input id="category_' + objjJSON.Categories[i].CategoryId + '_employee" type="radio" style="position:relative; top:-2px" checked="checked" value="2" name="category_' + objjJSON.Categories[i].CategoryId + '"></td><td><label for="category_' + objjJSON.Categories[i].CategoryId + '_employee" style="font-weight:normal; position: relative; top: 2px">' + utils.T('Employee') + '</label></td>';
                            html += '<td align=""><input id="category_' + objjJSON.Categories[i].CategoryId + '_external" type="radio" style="position:relative; top:-2px" value="3" name="category_' + objjJSON.Categories[i].CategoryId + '"></td><td><label for="category_' + objjJSON.Categories[i].CategoryId + '_external" style="font-weight:normal; position: relative; top: 2px">' + utils.T('External') + '</label></td>';
                            if (objjJSON.IsPM == false) {
                                html += '<td align=""><input id="category_' + objjJSON.Categories[i].CategoryId + '_general" type="radio" style="position:relative; top:-2px" value="1" name="category_' + objjJSON.Categories[i].CategoryId + '"></td><td><label for="category_' + objjJSON.Categories[i].CategoryId + '_general" style="font-weight:normal; position: relative; top: 2px">' + utils.T('General') + '</label></td>';
                            }
                            html += '</tr>'
                        }
                        html += "</table></div>"
                        
                        $divAddCategoryBody.html(html);
                        $("#divAddCategoryFooter").html('<div style="text-align:right;"><button class="btn btn-primary"  id="btnSave">' + utils.T('Save') + '</button><button class="btn btn-grey" id="btnCancelCategoryPopup">' + utils.T('Cancel') + '</button></div>');
                        $("#divAddCategory").modal("show");
                        //$(".rem-overlay, #divAddCategory").fadeIn();
                    } catch (ex) {
                        //Some issue occurred while fetching task details.
                    }
                }
            });
        }

        function bindCategory(category, pid, tid, taskParentId) {
            var id = 'project_' + pid + '_task_' + tid + '_Category_' + category.CategoryId + '_ctype_' + category.CategoryType,
                categoryType = '',
                strSetting = '';

            categoryType = GetCategoryType(category.CategoryType);

            strSetting = '<a href="#"  taskid="' + tid + '" projectid="' + pid + '" parenttaskid="' + taskParentId + '"  categoryid="' + category.CategoryId + '" categorytype="' + category.CategoryType + '" class="rem-rowlink rem-setting"  data-popup="category-resource" title="' + utils.T('Add resources to task') + '"><img src="../ResourceManagementControl/images/cogwheel.svg" alt="" width="16px" height="16px"/></a>';

            if (taskParentId != 0) {
                id = 'project_' + pid + '_parenttask_' + taskParentId + '_task_' + tid + '_Category_' + category.CategoryId + '_ctype_' + category.CategoryType;
            }
            $('<div class="rem-row row4 rem-row-project-category" id="' + id + '" datatype="category" categoryid="' + category.CategoryId + '" categorytype="' + category.CategoryType + '" taskid="' + tid + '" style="display:none">' + category.CategoryName + ' (' + categoryType + ')' + strSetting + '</div>').appendTo($projectBodyLeft);


            bindIntervalValues(4, category, tid, id, false);


        }



        function getDemandAllocated(type, obj, intervalIdentity, tid) {
            var demand = 0,
                allocated = 0,
                vDemand = 0,
                vAllocated = 0;
            if (type == 1) {
                if (obj.Tasks != undefined && obj.Tasks.length > 0) {
                    $.each(obj.Tasks, function (j, task) {
                        if (task.TaskKind == 3 && task.Categories != undefined && task.Categories.length > 0) {
                            $.each(task.Categories, function (k, category) {
                                if (category.Efforts != undefined && category.Efforts.length > 0) {

                                    $.each(category.Efforts, function (l, effort) {
                                        if (effort.IntervalIdentity == intervalIdentity) {
                                            //vDemand = setHoursFormat(effort.Demand);
                                            //vDemand = getNumberFromString(vDemand);
                                            //vAllocated = setHoursFormat(effort.Allocated);
                                            //vAllocated = getNumberFromString(vAllocated);
                                            demand += effort.Demand;
                                            allocated += effort.Allocated;
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
                totalDemand += demand;
                totalAllocated += allocated;
            } else if (type == 2) {
                var tasks = $.grep(obj.Tasks, function (e) {
                    return e.ParentTaskId == tid
                });
                if (tasks.length > 0) {
                    $.each(tasks, function (i, task) {
                        if (task.Categories != null) {
                            $.each(task.Categories, function (k, category) {
                                if (category.Efforts != undefined && category.Efforts.length > 0) {
                                    $.each(category.Efforts, function (l, effort) {
                                        if (effort.IntervalIdentity == intervalIdentity) {
                                            //vDemand = setHoursFormat(effort.Demand);
                                            //vDemand = getNumberFromString(vDemand);
                                            //vAllocated = setHoursFormat(effort.Allocated);
                                            //vAllocated = getNumberFromString(vAllocated);
                                            demand += effort.Demand;
                                            allocated += effort.Allocated;
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            } else if (type == 3 || type == 5) {
                $.each(obj.Categories, function (k, category) {
                    if (category.Efforts != undefined && category.Efforts.length > 0) {

                        $.each(category.Efforts, function (l, effort) {
                            if (effort.IntervalIdentity == intervalIdentity) {
                                //vDemand = setHoursFormat(effort.Demand);
                                //vDemand = getNumberFromString(vDemand);
                                //vAllocated = setHoursFormat(effort.Allocated);
                                //vAllocated = getNumberFromString(vAllocated);
                                demand += effort.Demand;
                                allocated += effort.Allocated;
                            }
                        });
                    }
                });
            } else if (type == 4) {
                if (obj.Efforts != undefined && obj.Efforts.length > 0) {
                    $.each(obj.Efforts, function (l, effort) {
                        if (effort.IntervalIdentity == intervalIdentity) {
                            //vDemand = setHoursFormat(effort.Demand);
                            //vDemand = getNumberFromString(vDemand);
                            //vAllocated = setHoursFormat(effort.Allocated);
                            //vAllocated = getNumberFromString(vAllocated);
                            demand += effort.Demand;
                            allocated += effort.Allocated;
                        }
                    });
                }
            }

            return {
                Demand: demand,
                Allocated: allocated
            };
        }

        function bindUserCategories() {
            var categoryType = '';

            if (model.data.Categories != null && model.data.Categories.length > 0) {
                $.each(model.data.Categories, function (i, category) {
                    categoryType = GetCategoryType(category.CategoryType);
                    $('<div class="rem-row row1" id="category_' + category.CategoryId + '_ctype_' + category.CategoryType + '"><img src="../ResourceManagementControl/images/ar-small.png" class="arrowUpImage" isHidden="false" datatype="category" data-row-class="row1"/>' + category.CategoryName + ' (' + categoryType + ')</div>').appendTo($userBodyLeft);
                    bindUserIntervalValues(1, category, null, "category_" + category.CategoryId + "_ctype_" + category.CategoryType);
                    if (category.Users != undefined && category.Users.length > 0) {
                        $.each(category.Users, function (j, user) {
                            bindUser(user, category.CategoryId, category.CategoryType);
                        });
                    }
                });
            }
        }

        function getProgressBar(intervalIdentity) {
            return '<div class="rem-detail r-bord"><table align="center" style="margin: auto"><tr><td>' +
                '<div id="divremainingSubmissionsPanelBody_' + intervalIdentity + '" class="progress-radial progress-0" style="display: block;float: left;">' +
                '<div class="overlay"><span id="Span_remainingSubmissions_' + intervalIdentity + '"></span>%</div></div></td><td>' +
                '<div >' +
            //'<span id="Span_remainingSubmissions_' + intervalIdentity + '">0</span>%' +
                '</div></td></tr></table></div>';
        }

        function bindUser(user, cid, ctype) {
            var userImage = '';

            if (user.UserImage == "")
                userImage = noPhotoPath + "/no-photo.jpg";
            else
                userImage = user.UserImage;

            $('<div class="rem-row row2 imgblock" id="category_' + cid + '_ctype_' + ctype + '_user_' + user.UserId + '">' +
                '<table width="100%" style="table-layout:fixed;">' +
                '<tr>' +
                '<td width="16"><img src="../ResourceManagementControl/images/ar-small-close.png" class="arrowUpImage" isHidden="true" datatype="category" data-row-class="row2"/></td>' +
                '<td width="32" height="32"><img height="26" width="26" src="' + userImage + '" alt=""></td>' +
                '<td class="rem-padleft"><strong>' + user.UserName + '</strong> <span class="des">' + user.Designation + '</span></td>' +
                '</tr>' +
                '</table>' +
                '</div>').appendTo($userBodyLeft);

            bindUserIntervalValues(2, user, user.UserId, 'category_' + cid + '_ctype_' + ctype + '_user_' + user.UserId);

            if (user.Projects != undefined && user.Projects.length > 0) {
                $.each(user.Projects, function (i, project) {
                    bindUserProject(project, user.UserId, cid, ctype);
                });
            }
        }

        function bindUserProject(project, uid, cid, ctype) {
            var projectMethodTypeImage = "";
            if (project.ProjectMethodType == 1) {
                projectMethodTypeImage = "../images/Waterfall.svg";
            } else {
                projectMethodTypeImage = "../images/Agile.svg";
            }
            $('<div class="rem-row row3" id="category_' + cid + '_ctype_' + ctype + '_user_' + uid + '_project_' + project.ProjectId + '" style="display:none"><img src="../ResourceManagementControl/images/ar-small-close.png" class="arrowUpImage" isHidden="true"  datatype="category" data-row-class="row3"/><img src="' + projectMethodTypeImage + '" alt=""><span class="spnProjectName"><a href="' + project.RedirectURL + '" target="_blank">' + project.ProjectName + '</a></span></div>').appendTo($userBodyLeft);

            bindUserIntervalValues(3, project, project.ProjectId, 'category_' + cid + '_ctype_' + ctype + '_user_' + uid + '_project_' + project.ProjectId, '', '', false);

            if (project.Tasks != undefined && project.Tasks.length > 0) {
                var tasks = $.grep(project.Tasks, function (e) {
                    return e.TaskKind == 2 || (e.TaskKind == 3 && e.ParentTaskId == 0)
                }),
                    childTasks = null;
                $.each(tasks, function (i, task) {
                    bindUserTask(task, cid, uid, project.ProjectId, project, ctype);
                    if (task.TaskKind == 2) {
                        childTasks = $.grep(project.Tasks, function (e) {
                            return e.ParentTaskId == task.TaskId
                        });
                        if (childTasks.length > 0) {
                            $.each(childTasks, function (j, ctask) {
                                bindUserTask(ctask, cid, uid, project.ProjectId, project, ctype);
                            });
                        }
                    }
                });
            }
        }

        function bindUserTask(task, cid, uid, pid, project, ctype) {
            var id = 'category_' + cid + '_ctype_' + ctype + '_user_' + uid + '_project_' + pid + '_task_' + task.TaskId,
                cls = "row4",
                $div = null,
                dataType = "task";
            if (task.TaskKind == 3 && task.ParentTaskId != 0) {
                cls = "row5";
                id = 'category_' + cid + '_ctype_' + ctype + '_user_' + uid + '_project_' + pid + '_parenttask_' + task.ParentTaskId + '_task_' + task.TaskId;
            } else if (task.TaskKind == 2) {
                id = 'category_' + cid + '_ctype_' + ctype + '_user_' + uid + '_project_' + pid + '_parenttask_' + task.TaskId;
                dataType = "parenttask";
            }

            if ($("#" + id).length > 0) {
                return;
            }
            if (cls == "row5") {
                $div = $('<div class="rem-row ' + cls + '" id="' + id + '" datatype="' + dataType + '" style="display:none"><img src="../ResourceManagementControl/images/ar-small-close.png" class="arrowUpImage" isHidden="true"  datatype="category" data-row-class="' + cls + '"/><span class="spnTaskName" title="' + task.TaskName + '"><a href="' + task.RedirectURL + '" target="_blank">' + (task.TaskKind == 2 ? '<strong>' : '') + task.TaskName + (task.TaskKind == 2 ? '</strong>' : '') + '</a></span></div>').appendTo($userBodyLeft);
            } else {
                $div = $('<div class="rem-row ' + cls + '" id="' + id + '" style="display:none"><img src="../ResourceManagementControl/images/ar-small-close.png" class="arrowUpImage" isHidden="true"  datatype="category" data-row-class="' + cls + '"/><span class="spnTaskName" title="' + task.TaskName + '"><a href="' + task.RedirectURL + '" target="_blank">' + (task.TaskKind == 2 ? '<strong>' : '') + task.TaskName + (task.TaskKind == 2 ? '</strong>' : '') + '</a></span></div>').appendTo($userBodyLeft);
            }

            if (task.TaskKind == 2) {
                bindUserIntervalValues(4, project, task.TaskId, id, cid, ctype);
            } else {
                $div.find(".arrowUpImage").hide();
                if (task.ParentTaskId == 0) {
                    bindUserIntervalValues(5, task, task.TaskId, id, cid, ctype);
                } else {
                    bindUserIntervalValues(6, task, task.TaskId, id, cid, ctype);
                }
            }
        }

        function padHours(num) {
            if (num <= 9) {
                return "0" + num.toString();
            }
            return num;
        }

        function setHoursFormat(valHours) {
            var hours = parseInt(valHours / 60);
            var minutes = parseInt(valHours) % 60;
            return hours + ":" + padHours(minutes);
        }

        function pad(str) {
            str = str.toString();
            return str.length < 2 ? str + "0" : str;
        }

        function getNumberFromString(valHours) {
            if (valHours == undefined) {
                return 0;
            }
            //            if (valHours.toString().lastIndexOf(':') == -1) {
            //                return parseInt(valHours) * 60;
            //            } else {
            var hours = parseInt(valHours.split(':')[0]);
            var minutes = parseInt(valHours.split(':')[1]);

            return (hours * 60) + minutes;

            //switch (minutes) {
            //    case 45:
            //        return parseFloat(hours + 0.75);
            //    case 30:
            //        return parseFloat(hours + 0.50);
            //    case 15:
            //        return parseFloat(hours + 0.25);
            //    default:
            //        return parseFloat(hours);
            //}
            //}
        }
        //type
        //1 = demand
        //2 = allocated
        function updateGapOfParent(id, totalVal, intervalIdentity, type) {
            var demandVal = 0,
                allocatedVal = 0,
                gap = 0;

            if (type == 1) {
                demandVal = totalVal;
                allocatedVal = getNumberFromString($("#" + id).find("input[intervalidentity=" + intervalIdentity + "][datamembertype=category-allocated]").val());
            } else {
                demandVal = getNumberFromString($("#" + id).find("input[intervalidentity=" + intervalIdentity + "][datamembertype=category-demand]").val());;
                allocatedVal = totalVal;
            }

            gap = demandVal - allocatedVal;

            gap = gap < 0 ? 0 : gap;

            $("#" + id).find("input[intervalidentity=" + intervalIdentity + "][datamembertype=category-gap]").val(setHoursFormat(Math.abs(gap))).removeClass("sty1").removeClass("sty2").removeClass("sty4").addClass(getCSSClassForGapField(gap));
        }

        function updateParentDemandValue(inputCategory) {
            var val = $(inputCategory).val(),
                categoryId = $(inputCategory).attr("categoryid"),
                id = $(inputCategory).closest(".rem-row").attr("id"),
                intervalIdentity = $(inputCategory).attr("intervalidentity"),
                categoryType = $(inputCategory).attr("categorytype"),
                totalVal = 0,
                parentType = '',
                demandVal = 0,
                allocatedVal = 0,
                gap = 0;

            id = id.replace("_Category_" + categoryId + "_ctype_" + categoryType, "");

            $("div[id^=" + id + "_] input[intervalidentity=" + intervalIdentity + "][datamembertype=category-demand]").each(function () {
                totalVal += parseFloat(getNumberFromString($(this).val()));
            });

            $("#" + id).find("input[intervalidentity=" + intervalIdentity + "][datamembertype=category-demand]").val(setHoursFormat(totalVal));
            updateGapOfParent(id, totalVal, intervalIdentity, 1);


            id = getParentId(id);
            parentType = $("#" + id).attr("datatype");
            totalVal = 0;

            if (parentType == "parenttask") {
                $("div[id^=" + id + "][datatype=innertask]  input[intervalidentity=" + intervalIdentity + "][datamembertype=category-demand]").each(function () {
                    totalVal += parseFloat(getNumberFromString($(this).val()));
                });
                $("#" + id).find("input[intervalidentity=" + intervalIdentity + "][datamembertype=category-demand]").val(setHoursFormat(totalVal));
                updateGapOfParent(id, totalVal, intervalIdentity, 1);
                id = getParentId(id);

            }
            totalVal = 0;

            $("div[id^=" + id + "][datatype=task]  input[intervalidentity=" + intervalIdentity + "][datamembertype=category-demand]").each(function () {
                totalVal += parseFloat(getNumberFromString($(this).val()));
            });
            $("div[id^=" + id + "][datatype=parenttask]  input[intervalidentity=" + intervalIdentity + "][datamembertype=category-demand]").each(function () {
                totalVal += parseFloat(getNumberFromString($(this).val()));
            });
            $("#" + id).find("input[intervalidentity=" + intervalIdentity + "][datamembertype=category-demand]").val(setHoursFormat(totalVal));
            updateGapOfParent(id, totalVal, intervalIdentity, 1);
        }

        function updateParentAllocatedValue(inputCategory) {
            var val = $(inputCategory).val(),
                categoryId = $(inputCategory).attr("categoryid"),
                id = $(inputCategory).closest(".rem-row").attr("id"),
                intervalIdentity = $(inputCategory).attr("intervalidentity"),
                categoryType = $(inputCategory).attr("categorytype"),
                totalVal = 0,
                parentType = '',
                demandVal = 0,
                allocatedVal = 0,
                gap = 0;

            id = id.replace("_Category_" + categoryId + '_ctype_' + categoryType, "");

            $("div[id^=" + id + "_] input[intervalidentity=" + intervalIdentity + "][datamembertype=category-allocated]").each(function () {
                totalVal += parseFloat(getNumberFromString($(this).val()));
            });

            $("#" + id).find("input[intervalidentity=" + intervalIdentity + "][datamembertype=category-allocated]").val(setHoursFormat(totalVal));
            updateGapOfParent(id, totalVal, intervalIdentity, 2);


            id = getParentId(id);
            parentType = $("#" + id).attr("datatype");
            totalVal = 0;

            if (parentType == "parenttask") {
                $("div[id^=" + id + "][datatype=innertask]  input[intervalidentity=" + intervalIdentity + "][datamembertype=category-allocated]").each(function () {
                    totalVal += parseFloat(getNumberFromString($(this).val()));
                });
                $("#" + id).find("input[intervalidentity=" + intervalIdentity + "][datamembertype=category-allocated]").val(setHoursFormat(totalVal));
                updateGapOfParent(id, totalVal, intervalIdentity, 2);
                id = getParentId(id);

            }
            totalVal = 0;

            $("div[id^=" + id + "][datatype=task]  input[intervalidentity=" + intervalIdentity + "][datamembertype=category-allocated]").each(function () {
                totalVal += parseFloat(getNumberFromString($(this).val()));
            });
            $("div[id^=" + id + "][datatype=parenttask]  input[intervalidentity=" + intervalIdentity + "][datamembertype=category-allocated]").each(function () {
                totalVal += parseFloat(getNumberFromString($(this).val()));
            });
            $("#" + id).find("input[intervalidentity=" + intervalIdentity + "][datamembertype=category-allocated]").val(setHoursFormat(totalVal));
            updateGapOfParent(id, totalVal, intervalIdentity, 2);
        }

        function updateCategoryParentAllocated(element) {
            var id = $(element).closest(".rem-row").attr("id"),
                dataUserType = $("#" + id).attr("datausertype"),
                intervalIdentity = $(element).attr("intervalidentity"),
                totalAllocated = 0;

            id = getParentId(id);
            if (dataUserType == "innertask") {

                $("div[id^=" + id + "_][datausertype=innertask] input[intervalidentity=" + intervalIdentity + "][data-type=user-allocated]").each(function () {
                    totalAllocated += parseFloat(getNumberFromString($(this).val()));
                });

                $("#" + id).find("input[intervalidentity=" + intervalIdentity + "][data-type=user-allocated]").val(setHoursFormat(totalAllocated));
                id = getParentId(id);
            }

            totalAllocated = 0;

            $("div[id^=" + id + "_][datausertype=summary] input[intervalidentity=" + intervalIdentity + "][data-type=user-allocated]").each(function () {
                totalAllocated += parseFloat(getNumberFromString($(this).val()));
            });

            $("div[id^=" + id + "_][datausertype=task] input[intervalidentity=" + intervalIdentity + "][data-type=user-allocated]").each(function () {
                totalAllocated += parseFloat(getNumberFromString($(this).val()));
            });
            $("#" + id).find("input[intervalidentity=" + intervalIdentity + "][data-type=user-allocated]").val(setHoursFormat(totalAllocated));

            id = getParentId(id);
            totalAllocated = 0;

            $("div[id^=" + id + "_][datausertype=project] input[intervalidentity=" + intervalIdentity + "][data-type=user-allocated]").each(function () {
                totalAllocated += parseFloat(getNumberFromString($(this).val()));
            });
            $("#" + id).find("input[intervalidentity=" + intervalIdentity + "][data-type=user-allocated]").val(setHoursFormat(totalAllocated));
            updateGapOfUserParent(id, totalAllocated, intervalIdentity);

            id = getParentId(id);
            totalAllocated = 0;

            $("div[id^=" + id + "_][datausertype=user] input[intervalidentity=" + intervalIdentity + "][data-type=user-allocated]").each(function () {
                totalAllocated += parseFloat(getNumberFromString($(this).val()));
            });
            $("#" + id).find("input[intervalidentity=" + intervalIdentity + "][data-type=user-allocated]").val(setHoursFormat(totalAllocated));
            updateGapOfUserParent(id, totalAllocated, intervalIdentity);
        }

        function updateGapOfUserParent(id, totalAllocated, intervalIdentity) {
            var capacity = $("#" + id).find("input[data-type=user-capacity][intervalidentity=" + intervalIdentity + "]").val();
            capacity = getNumberFromString(capacity);

            var gap = Math.abs(totalAllocated - capacity),
                per = -1;
            //gap = gap < 0 ? 0 : gap;
            var cls = "";

            if (totalAllocated > capacity) {
                cls = "sty1";
            } else if (totalAllocated < capacity) {
                per = (totalAllocated * 100) / capacity;
                if (per <= (100 - showUnderAllocation)) {
                    cls = "sty3";
                } else {
                    cls = "";
                }
            }
            $("#" + id).find("input[data-type=user-gap][intervalidentity=" + intervalIdentity + "]").val(setHoursFormat(Math.abs(gap))).removeClass("sty1").removeClass("sty3").addClass(cls);
            $("#" + id).find("input[data-type=user-gap][intervalidentity=" + intervalIdentity + "]").siblings(".hdnAllocatedPer").val(per);
        }

        function getParentId(id) {
            var idArr = id.split("_"),
                tempId = '';

            for (var i = 0; i < idArr.length - 2; i++) {
                tempId += idArr[i] + "_";
            }
            tempId = tempId.replace(/_\s*$/, "");
            return tempId;
        }

        //type
        //1 = project
        //2 = summary
        //3 = task
        //4 = category
        //5 = innertask
        function bindIntervalValues(type, obj, tid, Elementid, isNewCategory) {
            var $row = null,
                $rowDetail = null,
                objDemandAllocated = null,
                cls = "",
                clsBox = "sty4",
                readOnly = "",
                attributesData = "",
                style = "display:none",
                gap = 0,
                parentId = '';
            var elementId = Elementid.replace("project", "project_intervals");

            var dataType = "project";

            switch (type) {
                case 2:
                    dataType = "parenttask";
                    break;
                case 3:
                    dataType = "task";
                    break;
                case 4:
                    dataType = "category";
                    break;
                case 5:
                    dataType = "innertask";
                    break;
                default:
                    dataType = "project";
                    style = "display:block";
                    break;
            }

            if (isNewCategory) {
                style = "display:block";
                parentId = getParentId(elementId);
                parentId = getParentId(parentId);
                $row = $('<div class="rem-row" id=' + elementId + ' datatype="' + dataType + '" style="' + style + '"></div>').insertAfter($("#divProjects .rem-body .rem-bodyright .scrollWidthBody div[id^=" + parentId + "_]:last"));

            } else {
                $row = $('<div class="rem-row" id=' + elementId + ' datatype="' + dataType + '" style="' + style + '"></div>').appendTo($projectBodyRightContent);
            }
            if (type != 4) {
                readOnly = "readonly='readonly'";
                clsBox = "";
            } else {
                attributesData = " categoryid=\"" + obj.CategoryId + "\" taskid=\"" + tid + "\" rowtype=\"category-row\" categorytype='" + obj.CategoryType + "' projectid='" + Elementid.split("_")[1] + "'";
            }

            var taskStartDate, taskEndDate;
            if (type == 4) {
                if (typeof obj.TaskStartDate !== 'date') {
                    if (obj.TaskStartDate.indexOf('/') > 0) {
                        taskStartDate = new Date(convertToUniversalDatetimeFormat(obj.TaskStartDate));
                        taskEndDate = new Date(convertToUniversalDatetimeFormat(obj.TaskEndDate));
                    }
                    else {
                        taskStartDate = getExactDate(obj.TaskStartDate);
                        taskEndDate = getExactDate(obj.TaskEndDate);
                    }
                } else {
                    taskStartDate = obj.TaskStartDate;
                    taskEndDate = obj.TaskEndDate;
                }
                taskStartDate.setHours(0, 0, 0, 0);
                taskEndDate.setHours(0, 0, 0, 0);
            }
            if (model.data.Intervals != null && model.data.Intervals.length > 0) {
                setTimeout(function () {
                    $.each(model.data.Intervals, function (i, interval) {
                        var readOnly = '';
                        var intervalStartDate = getExactDate(interval.StartDate);
                        var intervalEndDate = getExactDate(interval.EndDate);

                        if (type == 4) {
                            if (intervalStartDate && taskStartDate && intervalEndDate && taskEndDate) {
                                if (strInterval == 1) {
                                    if (intervalStartDate < taskStartDate || intervalStartDate > taskEndDate) {
                                        readOnly = 'readonly="readonly"';
                                    }
                                }
                                else {
                                    if ((intervalStartDate >= taskStartDate && intervalStartDate <= taskEndDate) || (intervalEndDate >= taskStartDate && intervalEndDate <= taskEndDate) || (taskStartDate >= intervalStartDate && taskStartDate <= intervalEndDate) || (taskEndDate >= intervalStartDate && taskEndDate <= intervalEndDate)) {
                                        readOnly = "";
                                    }
                                    else {
                                        readOnly = 'readonly="readonly"';
                                    }
                                }
                            }
                        }
                        else {
                            readOnly = 'readonly="readonly"';
                        }
                        $rowDetail = $('<div class="rem-detail r-bord"></div>').appendTo($row);
                        objDemandAllocated = getDemandAllocated(type, obj, interval.IntervalIdentity, tid);
                        var styleOverride = "style= \"margin: auto; float: none\" ";
                        if (settings.allocated.visible && settings.gap.visible) {
                            styleOverride = "";
                        }
                        $('<div class="r-box" ' + styleOverride + '> <input class="box-field ' + clsBox + '" type="text" datamembertype=\"category-demand\" ' + readOnly + ' value="' + setHoursFormat(objDemandAllocated.Demand) + '" data-old="' + setHoursFormat(objDemandAllocated.Demand) + '"' + readOnly + attributesData + ' intervalidentity="' + interval.IntervalIdentity + '" data-original="' + setHoursFormat(objDemandAllocated.Demand) + '"></div>').appendTo($rowDetail);
                        if (settings.allocated.visible) {
                            $('<div class="r-box"><input class="box-field" ' + attributesData + ' datamembertype=\"category-allocated\" readonly="readonly" type="text" value="' + setHoursFormat(objDemandAllocated.Allocated) + '" intervalidentity="' + interval.IntervalIdentity + '"></div>').appendTo($rowDetail);
                        }

                        if (settings.gap.visible) {
                            gap = (objDemandAllocated.Demand - objDemandAllocated.Allocated);
                            gap = gap < 0 ? 0 : gap;

                            cls = getCSSClassForGapField(gap);

                            $('<div class="r-box"><input datamembertype=\"category-gap\" ' + attributesData + ' readonly = "readonly" class="box-field ' + cls + '" type="text" value="' + setHoursFormat(gap) + '" intervalidentity="' + interval.IntervalIdentity + '"></div>').appendTo($rowDetail);
                        }
                    });
                }, 2);
            }

        }

        //type
        //1 = category
        //2 = user
        //3 = project
        //4 = summary
        //5 = task
        //6 = innertask
        function bindUserIntervalValues(type, obj, tid, ElementId, categoryId, ctype, isFromPopup) {
            var $row = null,
                $rowDetail = null,
                objCapacityAllocated = null,
                cls = "",
                clsBox = "sty4",
                readOnly = "",
                attributesData = "",
                style = "display:none",
                gap = 0,
                parentElementId = '',
                isUserOnHoliday = false;
            var intervalElementId = ElementId.replace("category", "category_intervals");

            if (type != 1) {
                parentElementId = getParentId(intervalElementId);
            }

            var dataType = "project";

            switch (type) {
                case 2:
                    dataType = "user";
                    style = "display:block";
                    break;
                case 3:
                    dataType = "project";
                    break;
                case 4:
                    dataType = "summary";
                    break;
                case 5:
                    dataType = "task";
                    break;
                case 6:
                    dataType = "innertask";
                    break;
                default:
                    dataType = "category";
                    style = "display:block";
                    break;
            }

            if (isFromPopup) {
                style = "display:block";
            }

            $row = $('<div class="rem-row" id="' + intervalElementId + '" datausertype="' + dataType + '" style="' + style + '"></div>');
            var parentElements = $("#divUsers .rem-body .rem-bodyright .scrollWidthBody div[id^=" + parentElementId + "_]:last");
            if (parentElements.length > 0) {
                $row.insertAfter(parentElements);
                parentElements = null;
            } else {
                if ($("#" + parentElementId).length == 0) {
                    $row.appendTo($userBodyRightContent);
                } else {
                    $row.insertAfter($("#" + parentElementId));
                }
            }

            if (type != 5 && type != 6) {
                readOnly = "readonly='readonly'";
                clsBox = "";
            } else {
                attributesData = " datamembertype=\"user\" categoryid=\"" + categoryId + "\" taskid=\"" + tid + "\" categorytype='" + ctype + "' projectid='" + ElementId.split("_")[7] + "'";
            }

            var taskStartDate, taskEndDate;
            if (type == 5 || type == 6) {
                if (obj.TaskStartDate.indexOf('/') > 0) {
                    taskStartDate = new Date(convertToUniversalDatetimeFormat(obj.TaskStartDate));
                    taskEndDate = new Date(convertToUniversalDatetimeFormat(obj.TaskEndDate));
                }
                else {
                    taskStartDate = getExactDate(obj.TaskStartDate);
                    taskEndDate = getExactDate(obj.TaskEndDate);
                }
                taskStartDate.setHours(0, 0, 0, 0);
                taskEndDate.setHours(0, 0, 0, 0);
            }

            if (model.data.Intervals != null && model.data.Intervals.length > 0) {
                setTimeout(function () {
                    $.each(model.data.Intervals, function (i, interval) {

                        if (type == 5 || type == 6) {
                            isUserOnHoliday = checkIfUserIsOnLeave(categoryId, ElementId.split("_")[5], ctype, interval.IntervalIdentity);
                            var intervalStartDate = getExactDate(interval.StartDate);
                            var intervalEndDate = getExactDate(interval.EndDate);

                            if (isUserOnHoliday) {
                                readOnly = "readonly='readonly'";
                            } else {
                                readOnly = "";
                                if (strInterval == 1) {
                                    if (intervalStartDate < taskStartDate || intervalStartDate > taskEndDate) {
                                        readOnly = "readonly='readonly'";
                                    }
                                }
                                else {
                                    if ((intervalStartDate >= taskStartDate && intervalStartDate <= taskEndDate) || (intervalEndDate >= taskStartDate && intervalEndDate <= taskEndDate) || (taskStartDate >= intervalStartDate && taskStartDate <= intervalEndDate) || (taskEndDate >= intervalStartDate && taskEndDate <= intervalEndDate)) {
                                    }
                                    else {
                                        readOnly = "readonly='readonly'";
                                    }
                                }
                            }
                        }
                        $rowDetail = $('<div class="rem-detail r-bord"></div>').appendTo($row);
                        objCapacityAllocated = getCapacityAllocated(type, obj, interval.IntervalIdentity, tid);

                        if (type == 1 || type == 2) {
                            $('<div class="r-box"><input class="box-field" data-type="user-capacity" readonly = "readonly" intervalidentity="' + interval.IntervalIdentity + '" type="text" value="' + setHoursFormat(objCapacityAllocated.Capacity) + '"></div>').appendTo($rowDetail);
                        } else {
                            $('<div class="r-box"></div>').appendTo($rowDetail);
                        }
                        $('<div class="r-box"><input class="box-field ' + clsBox + '" type="text" value="' + setHoursFormat(objCapacityAllocated.Allocated) + '" data-type="user-allocated" ' + readOnly + attributesData + ' intervalidentity="' + interval.IntervalIdentity + '" data-old="' + setHoursFormat(objCapacityAllocated.Allocated) + '" data-original="' + setHoursFormat(objCapacityAllocated.Allocated) + '"></div>').appendTo($rowDetail);

                        if (type == 1 || type == 2) {
                            var per = -1;
                            if ((objCapacityAllocated.Capacity < objCapacityAllocated.Allocated)) {
                                cls = "sty1";
                            } else {
                                per = (objCapacityAllocated.Allocated * 100) / objCapacityAllocated.Capacity;
                                if (per <= (100 - showUnderAllocation)) {
                                    cls = "sty3";
                                } else {
                                    cls = "";
                                }
                            }
                            gap = Math.abs(objCapacityAllocated.Capacity - objCapacityAllocated.Allocated);

                            //gap = gap < 0 ? 0 : gap;
                            $('<div class="r-box"><input type="hidden"  class="hdnAllocatedPer" value="' + per + '"><input readonly = "readonly" class="box-field ' + cls + '" data-type="user-gap" type="text" value="' + setHoursFormat(gap) + '" intervalidentity="' + interval.IntervalIdentity + '"></div>').appendTo($rowDetail);
                        } else {
                            $('<div class="r-box"></div>').appendTo($rowDetail);
                        }
                    });
                }, 2);
            }
        }

        function getExactDate(dtsDate) {
            /*
            var splitData = dtsDate.split('T');
            var dateOnly = splitData[0].split('-');
            var timeOnly = splitData[1] != undefined ? splitData[1].split(':') : "00:00:00".split(':');
            return new Date(dateOnly[0], dateOnly[1] - 1, dateOnly[2], timeOnly[0], timeOnly[1], timeOnly[2]);
            */
            return new Date(dtsDate);
        }

        function getCapacityAllocated(type, obj, intervalIdentity, tid) {
            var capacity = 0,
                allocated = 0,
                vCapacity = 0,
                vAllocated = 0;
            if (type == 1) {
                $.each(obj.Users, function (i, user) {
                    if (user.Capacity != undefined && user.Capacity) {
                        $.each(user.Capacity, function (j, cap) {
                            if (cap.IntervalIdentity == intervalIdentity) {
                                //vCapacity = setHoursFormat(cap.Capacity);
                                //vCapacity = getNumberFromString(vCapacity);
                                capacity += cap.Capacity;
                            }
                        });
                    }

                    if (user.Projects != undefined && user.Projects.length > 0) {
                        $.each(user.Projects, function (j, project) {
                            if (project.Tasks != undefined && project.Tasks.length > 0) {
                                $.each(project.Tasks, function (k, task) {
                                    if (task.TaskKind == 3) {
                                        if (task.Efforts != undefined && task.Efforts.length > 0) {

                                            $.each(task.Efforts, function (l, effort) {
                                                if (effort.IntervalIdentity == intervalIdentity) {
                                                    //vAllocated = setHoursFormat(effort.Allocated);
                                                    //vAllocated = getNumberFromString(vAllocated);
                                                    allocated += effort.Allocated;
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                        });
                    }
                });
            } else if (type == 2) {
                if (obj.Capacity != undefined && obj.Capacity.length > 0) {
                    $.each(obj.Capacity, function (j, cap) {
                        if (cap.IntervalIdentity == intervalIdentity) {
                            //vCapacity = setHoursFormat(cap.Capacity);
                            //vCapacity = getNumberFromString(vCapacity);
                            capacity += cap.Capacity;
                        }
                    });
                }
                if (obj.Projects != undefined && obj.Projects.length > 0) {
                    $.each(obj.Projects, function (j, project) {
                        if (project.Tasks != undefined && project.Tasks.length > 0) {
                            $.each(project.Tasks, function (k, task) {
                                if (task.TaskKind == 3) {
                                    if (task.Efforts != undefined && task.Efforts.length > 0) {

                                        $.each(task.Efforts, function (l, effort) {
                                            if (effort.IntervalIdentity == intervalIdentity) {
                                                //vAllocated = setHoursFormat(effort.Allocated);
                                                //vAllocated = getNumberFromString(vAllocated);
                                                allocated += effort.Allocated;
                                            }
                                        });
                                    }
                                }
                            });
                        }
                    });
                }
            } else if (type == 3) {
                if (obj.Tasks != undefined && obj.Tasks.length > 0) {
                    $.each(obj.Tasks, function (k, task) {
                        if (task.TaskKind == 3) {
                            if (task.Efforts != undefined && task.Efforts.length > 0) {

                                $.each(task.Efforts, function (l, effort) {
                                    if (effort.IntervalIdentity == intervalIdentity) {
                                        //vAllocated = setHoursFormat(effort.Allocated);
                                        //vAllocated = getNumberFromString(vAllocated);
                                        allocated += effort.Allocated;
                                    }
                                });
                            }
                        }
                    });
                }
            } else if (type == 4) {
                if (obj.Tasks != undefined) {
                    var tasks = $.grep(obj.Tasks, function (e) {
                        return e.ParentTaskId == tid
                    });
                    if (tasks.length > 0) {
                        $.each(tasks, function (i, task) {
                            if (task.Efforts != undefined && task.Efforts.length > 0) {
                                $.each(task.Efforts, function (k, effort) {
                                    if (effort.IntervalIdentity == intervalIdentity) {
                                        //vAllocated = setHoursFormat(effort.Allocated);
                                        //vAllocated = getNumberFromString(vAllocated);
                                        allocated += effort.Allocated;
                                    }
                                });
                            }
                        });
                    }
                }
            } else if (type == 5 || type == 6) {
                if (obj.Efforts != undefined && obj.Efforts.length > 0) {
                    $.each(obj.Efforts, function (k, effort) {
                        if (effort.IntervalIdentity == intervalIdentity) {
                            //vAllocated = setHoursFormat(effort.Allocated);
                            //vAllocated = getNumberFromString(vAllocated);
                            allocated += effort.Allocated;
                        }
                    });
                }
            }

            return {
                Capacity: capacity,
                Allocated: allocated
            };
        }

        function getCSSClassForGapField(val) {
            var cls = "";

            if (val > 600) {
                cls = "sty1";
            } else if (val > 0) {
                cls = "sty2";
            }

            return cls;
        }

        function DAM(args) {
            var list = '';
            for (var key in args) {
                var value = args[key];
                list = list + key + '\n';
            }
            alert(list);
        }

        function GetCategoryType(categoryType) {

            switch (categoryType) {
                case 1:
                    categoryType = utils.T('General');
                    break;
                case 2:
                    categoryType = utils.T('Internal');
                    break;
                case 3:
                    categoryType = utils.T('External');
                    break;
            }

            return categoryType;
        }

        function getDataFromJSON(type, entityRequired, cid, pid, tid, uid, ctype) {
            var obj = null,
                objProject, objTask, objCategory, objUser;
            if (type.toLowerCase() == "project") {
                if (pid !== 'undefined') {
                    objProject = $.grep(model.data.Projects, function (e) {
                        return e.ProjectId == pid
                    });
                } else {
                    objProject = [ model.data.Project ];
                }

                if (objProject.length > 0) {
                    if (entityRequired.toLowerCase() == "project") {
                        return objProject[0];
                    }
                    if (tid != undefined) {
                        objTask = $.grep(objProject[0].Tasks, function (e) {
                            return e.TaskId == tid
                        });
                        if (objTask.length > 0) {
                            if (entityRequired.toLowerCase() == "task") {
                                return objTask[0];
                            }
                            objCategory = $.grep(objTask[0].Categories, function (e) {
                                return e.CategoryId == cid && e.CategoryType == ctype
                            });
                            if (objCategory.length > 0) {
                                if (entityRequired.toLowerCase() == "category") {
                                    return objCategory[0];
                                }
                            }
                        }
                    } else {
                        objCategory = $.grep(objProject[0].Categories, function (e) {
                            return e.CategoryId == cid && e.CategoryType == ctype
                        });
                        if (objCategory.length > 0) {
                            if (entityRequired.toLowerCase() == "category") {
                                return objCategory[0];
                            }
                        }
                    }
                }
            } else if (type.toLowerCase() == "category") {
                objCategory = $.grep(model.data.Categories, function (e) {
                    return e.CategoryId == cid && e.CategoryType == ctype
                });
                if (objCategory.length > 0) {
                    if (entityRequired.toLowerCase() == "category") {
                        return objCategory[0];
                    }
                    objUser = $.grep(objCategory[0].Users, function (e) {
                        return e.UserId == uid
                    });
                    if (objUser.length > 0) {
                        if (entityRequired.toLowerCase() == "user") {
                            return objUser[0];
                        }
                        objProject = $.grep(objUser[0].Projects, function (e) {
                            return e.ProjectId == pid
                        });
                        if (objProject.length > 0) {
                            if (entityRequired.toLowerCase() == "project") {
                                return objProject[0];
                            }
                            objTask = $.grep(objProject[0].Tasks, function (e) {
                                return e.TaskId == tid
                            });
                            if (objTask.length > 0) {
                                if (entityRequired.toLowerCase() == "task") {
                                    return objTask[0];
                                }
                            }
                        }
                    }
                }
            }
            return obj;
        }

        function checkIfUserIsOnLeave(cid, uid, ctype, intervalIdentity) {
            var obj = getDataFromJSON("category", "user", cid, 0, 0, uid, ctype),
                objInterval = [];

            if (obj != null && obj.Capacity != null && obj.Capacity.length > 0) {
                objInterval = $.grep(obj.Capacity, function (e) {
                    return e.IntervalIdentity == intervalIdentity
                });
                if (objInterval.length > 0) {
                    return objInterval[0].IsUserOnHoliday;
                }
            }
            return false;
        }

        function showCategoryTask(userCategoryTaskId) {
            var userCategoryIntervalTaskId = userCategoryTaskId.replace("category", "category_intervals");
            var leftDivParentId = getParentId(userCategoryTaskId),
                rightDivParentId = getParentId(userCategoryIntervalTaskId);
            $("#" + userCategoryTaskId).show();
            $("#" + userCategoryIntervalTaskId).show();


            if (leftDivParentId.split("_").length > 4) {

                showCategoryTask(leftDivParentId);
            }


        }

        function setSelectionRange(input, selectionStart, selectionEnd) {
            if (input.setSelectionRange) {
                input.focus();
                input.setSelectionRange(selectionStart, selectionEnd);
            } else if (input.createTextRange) {
                var range = input.createTextRange();
                range.collapse(true);
                range.moveEnd('character', selectionEnd);
                range.moveStart('character', selectionStart);
                range.select();
            }
        }

        function setCaretToPos(input, pos) {
            setSelectionRange(input, pos, pos);
        }

        function addResourcesInBothPanel() {
            var tempId = "project_" + projectId,
                        divCategoryId = '',
                        objCategory = {},
                        categoryType = '',
                        userImage = '',
                        projectMethodTypeImage = '',
                        parentElementId = '',
                        objMain = {},
                        objUser = {},
                        objProject = {},
                        objTask = {},
                        $ele = null,
                        tempTaskId = "project_" + projectId,
                        strSetting = '';

            if (parentTaskId != 0) {
                tempTaskId += "_parenttask_" + parentTaskId;
            }
            tempTaskId += "_task_" + taskId;
            var opTask = null;
            if (popupTasks.length > 0) {
                opTask = $.grep(popupTasks, function (e) {
                    return e.TaskId == taskId
                });
            }

            //Add data of resources start
            $.each(selectedUsers, function (i, obj) {
                obj.Users = [];
                tempId = "category_" + obj.CategoryId + "_ctype_" + obj.CategoryType;
                divCategoryId = tempTaskId + "_Category_" + obj.CategoryId + "_ctype_" + obj.CategoryType;
                categoryType = GetCategoryType(obj.CategoryType);

                if ($("#" + divCategoryId).length == 0) {
                    objCategory = {};
                    objCategory.CategoryId = obj.CategoryId;
                    objCategory.CategoryName = obj.CategoryName;
                    objCategory.CategoryType = obj.CategoryType;
                    if (opTask != null && opTask.length > 0) {
                        objCategory.TaskStartDate = opTask[0].TaskStartDate;
                        objCategory.TaskEndDate = opTask[0].TaskEndDate;
                    }
                    objCategory.Efforts = [];

                    strSetting = '<a href="#"  taskid="' + taskId + '" projectid="' + projectId + '" parenttaskid="' + parentTaskId + '"  categoryid="' + obj.CategoryId + '" categorytype="' + obj.CategoryType + '" class="rem-rowlink rem-setting"  data-popup="category-resource" title="' + utils.T('Add resources to task') + '"><img src="../ResourceManagementControl/images/cogwheel.svg" alt="" width="16px" height="16px"/></a>';

                    $('<div class="rem-row row4 rem-row-project-category" id="' + divCategoryId + '" datatype="category" categoryid="' + objCategory.CategoryId + '" categorytype="' + objCategory.CategoryType + '" taskid="' + taskId + '">' + obj.CategoryName + ' (' + categoryType + ')' + strSetting + '</div>').insertAfter($("#divProjects .rem-body .rem-bodyleft div[id^=" + tempTaskId + "_]:last"));
                    bindIntervalValues(4, objCategory, taskId, divCategoryId, true);

                    objMain = getDataFromJSON("project", "task", objCategory.CategoryId, projectId, taskId, 0, objCategory.CategoryType);
                    if (objMain != null) {
                        objMain.Categories.push(objCategory);
                    }
                }


                //Insert in user panel
                if ($("#" + tempId).length == 0) {
                    categoryType = GetCategoryType(obj.CategoryType);
                    $('<div class="rem-row row1" id="' + tempId + '"><img src="../ResourceManagementControl/images/ar-small.png" class="arrowUpImage" isHidden="false" datatype="category" data-row-class="row1"/>' + obj.CategoryName + ' (' + categoryType + ')</div>').appendTo($userBodyLeft);

                    bindUserIntervalValues(1, obj, taskId, tempId, obj.CategoryId, obj.CategoryType);

                    objMain = getDataFromJSON("category", "category", obj.CategoryId, projectId, taskId, obj.UserId, obj.CategoryType);
                    if (objMain == null) {
                        objCategory = {};
                        objCategory.CategoryId = obj.CategoryId;
                        objCategory.CategoryName = obj.CategoryName;
                        objCategory.CategoryType = obj.CategoryType;
                        objCategory.Users = [];
                        model.data.Categories.push(objCategory);
                    }
                }
                objMain = getDataFromJSON("category", "category", obj.CategoryId, projectId, taskId, obj.UserId, obj.CategoryType);
                objUser = null;
                objUser = $.grep(objMain.Users, function (e) {
                    return e.UserId == obj.UserId
                });

                if (objUser == null || objUser.length == 0) {
                    objUser = {};
                    objUser.UserId = obj.UserId;
                    objUser.UserName = obj.UserName;
                    objUser.Designation = obj.Designation;
                    objUser.UserImage = obj.UserImage;
                    objUser.Capacity = [];
                    objUser.Projects = [];
                    objMain.Users.push(objUser);
                }

                tempId += "_user_" + obj.UserId;
                if ($("#" + tempId).length == 0) {
                    if (obj.UserImage == "")
                        userImage = noPhotoPath + "/no-photo.jpg";
                    else
                        userImage = obj.UserImage;

                    $ele = $('<div class="rem-row row2 imgblock" id="' + tempId + '">' +
                                '<table width="100%" style="table-layout:fixed;">' +
                                '<tr>' +
                                '<td width="16"><img src="../ResourceManagementControl/images/ar-small.png" class="arrowUpImage" isHidden="false" datatype="category" data-row-class="row2"/></td>' +
                                '<td width="32" height="32"><img height="30" width="30" src="' + userImage + '" alt=""></td>' +
                                '<td class="rem-padleft"><strong>' + obj.UserName + '</strong> <span class="des">' + obj.Designation + '</span></td>' +
                                '</tr>' +
                                '</table>' +
                                '</div>');
                    parentElementId = getParentId(tempId);

                    if ($("div[id^=" + parentElementId + "_]").length > 0) {
                        $ele.insertAfter("#divUsers .rem-body .rem-bodyleft div[id^=" + parentElementId + "_]:last");
                    } else {
                        $ele.insertAfter("#" + parentElementId);
                    }

                    bindUserIntervalValues(2, obj, obj.UserId, tempId);

                }


                tempId += "_project_" + projectId;
                objUser = objUser[0] || objUser;
                objProject = null
                if (objUser.Projects.length > 0) {
                    objProject = $.grep(objUser.Projects, function (e) {
                        return e.ProjectId == projectId
                    });
                }

                if (objProject == null || objProject.length == 0) {
                    objProject = JSON.parse(JSON.stringify(projectData));
                    objProject.Tasks = [];
                    objUser.Projects.push(objProject);
                }
                if ($("#" + tempId).length == 0) {
                    if (projectData.ProjectMethodType == 1) {
                        projectMethodTypeImage = "../images/Waterfall.svg";
                    } else {
                        projectMethodTypeImage = "../images/Agile.svg";
                    }
                    $ele = $('<div class="rem-row row3" id="' + tempId + '"><img src="../ResourceManagementControl/images/ar-small.png" class="arrowUpImage" isHidden="false"  datatype="category" data-row-class="row3"/><img src="' + projectMethodTypeImage + '" alt=""><span class="spnProjectName"><a href="' + projectData.RedirectURL + '" target="_blank">' + projectData.ProjectName + '</a></span></div>');

                    parentElementId = getParentId(tempId);

                    if ($("#divUsers .rem-body .rem-bodyleft div[id^=" + parentElementId + "_]").length > 0) {
                        $ele.insertAfter("#divUsers .rem-body .rem-bodyleft div[id^=" + parentElementId + "_]:last");
                    } else {
                        $ele.insertAfter("#" + parentElementId);
                    }

                    bindUserIntervalValues(3, projectData, projectData.ProjectId, tempId, '', '', true);
                    //objProject = $.grep(objUser.Projects, function(e){ return e.ProjectId == projectId});

                }

                objProject = objProject[0] || objProject;


                if (parentTaskId > 0) {
                    tempId += "_parenttask_" + parentTaskId;

                    if ($("#" + tempId).length == 0) {

                        $ele = $('<div class="rem-row row4" id="' + tempId + '" datatype="parenttask"><img src="../ResourceManagementControl/images/ar-small.png" class="arrowUpImage" isHidden="false"  datatype="category" data-row-class="row4"/><span class="spnTaskName" title="' + parentTaskData.TaskName + '"><a href="' + parentTaskData.RedirectURL + '"><strong>' + parentTaskData.TaskName + '</strong></a></span></div>');

                        parentElementId = getParentId(tempId);

                        if ($("div[id^=" + parentElementId + "_]").length > 0) {
                            $ele.insertAfter("div[id^=" + parentElementId + "_]:last");
                        } else {
                            $ele.insertAfter("#" + parentElementId);
                        }
                        bindUserIntervalValues(4, projectData, taskId, tempId, obj.CategoryId, obj.CategoryType, true);
                        objTask = null;
                        if (objProject.Tasks.length > 0) {
                            objTask = $.grep(objProject.Tasks, function (e) {
                                return e.TaskId == parentTaskId
                            });
                        }
                        if (objTask == null || objTask.length == 0) {
                            objTask = JSON.parse(JSON.stringify(parentTaskData));
                            objTask.ParentTaskId = 0;
                            objTask.TaskKind = 2
                            objTask.Efforts = [];
                            objProject.Tasks.push(objTask);
                        }
                    }

                }

                tempId += "_task_" + taskId;
                objTask = null;
                if (objProject.Tasks.length > 0) {
                    objTask = $.grep(objProject.Tasks, function (e) {
                        return e.TaskId == taskId
                    });
                }
                if (objTask == null || objTask.length == 0) {
                    objTask = {};
                    objTask.TaskId = taskData.TaskId;
                    objTask.TaskName = taskData.TaskName;
                    objTask.TaskKind = 3;
                    objTask.ParentTaskId = parentTaskId;
                    objTask.Efforts = [];
                    objProject.Tasks.push(objTask);
                }

                if ($("#" + tempId).length == 0) {

                    $ele = $('<div class="rem-row ' + (parentTaskId > 0 ? 'row5' : 'row4') + '" id="' + tempId + '" datatype="task"><span class="spnTaskName" title="' + taskData.TaskName + '"><a href="' + taskData.RedirectURL + '" target="_blank">' + taskData.TaskName + '</a></span></div>');
                    parentElementId = getParentId(tempId);

                    if ($("div[id^=" + parentElementId + "_]").length > 0) {
                        $ele.insertAfter("div[id^=" + parentElementId + "_]:last");
                    } else {
                        $ele.insertAfter("#" + parentElementId);
                    }

                    taskData.TaskStartDate = opTask[0].TaskStartDate;
                    taskData.TaskEndDate = opTask[0].TaskEndDate;

                    if (parentTaskId == 0) {
                        bindUserIntervalValues(5, taskData, taskId, tempId, obj.CategoryId, obj.CategoryType, true);
                    } else {
                        bindUserIntervalValues(6, taskData, taskId, tempId, obj.CategoryId, obj.CategoryType, true);
                    }
                }

            });
            //Add data of resources ends
        }

        function setReadonlyAfterTaskChanged() {
            var opTask = null,
                taskStartDate = '',
                taskEndDate = '';
            if (popupTasks.length > 0) {
                opTask = $.grep(popupTasks, function (e) {
                    return e.TaskId == taskId
                });
            }
            if (opTask != null && opTask.length > 0) {
                var taskStartDate = new Date(convertToUniversalDatetimeFormat(opTask[0].TaskStartDate));
                var taskEndDate = new Date(convertToUniversalDatetimeFormat(opTask[0].TaskEndDate));

                taskStartDate.setHours(0, 0, 0, 0);
                taskEndDate.setHours(0, 0, 0, 0);

                // Category Calculation Start Here
                $("input[datamembertype='category-demand'][rowtype='category-row'][taskid='" + taskId + "']").each(function () {
                    if (model.data.Intervals != null && model.data.Intervals.length > 0) {
                        var currentIntervalIdentity = $(this).attr("intervalidentity");
                        var objInterval = $.grep(model.data.Intervals, function (e) {
                            return e.IntervalIdentity == currentIntervalIdentity
                        });
                        if (objInterval != null && objInterval.length > 0) {
                            var intervalStartDate = getExactDate(objInterval[0].StartDate);
                            var intervalEndDate = getExactDate(objInterval[0].EndDate);

                            var blnReadOnly = false;
                            if (intervalStartDate && taskStartDate && intervalEndDate && taskEndDate) {
                                if (strInterval == 1) {
                                    if (intervalStartDate < taskStartDate || intervalStartDate > taskEndDate) {
                                        blnReadOnly = true;
                                    }
                                }
                                else {
                                    if ((intervalStartDate >= taskStartDate && intervalStartDate <= taskEndDate) || (intervalEndDate >= taskStartDate && intervalEndDate <= taskEndDate) || (taskStartDate >= intervalStartDate && taskStartDate <= intervalEndDate) || (taskEndDate >= intervalStartDate && taskEndDate <= intervalEndDate)) {
                                        blnReadOnly = false;
                                    }
                                    else {
                                        blnReadOnly = true;
                                    }
                                }
                            }
                        }

                        if (blnReadOnly == true) {
                            $(this).attr("readonly", "readonly");
                        }
                        else {
                            $(this).removeAttr("readonly");
                        }
                    }
                });
                // Category Calculation End Here


                //User Calculation Start Here
                $("input[datamembertype='user'][data-type='user-allocated'][taskid='" + taskId + "']").each(function () {
                    if (model.data.Intervals != null && model.data.Intervals.length > 0) {
                        var currentIntervalIdentity = $(this).attr("intervalidentity");
                        var objInterval = $.grep(model.data.Intervals, function (e) {
                            return e.IntervalIdentity == currentIntervalIdentity
                        });
                        if (objInterval != null && objInterval.length > 0) {

                            var intervalStartDate = getExactDate(objInterval[0].StartDate);
                            var intervalEndDate = getExactDate(objInterval[0].EndDate);

                            var blnReadOnly = false;
                            if (intervalStartDate && taskStartDate && intervalEndDate && taskEndDate) {
                                if (strInterval == 1) {
                                    if (intervalStartDate < taskStartDate || intervalStartDate > taskEndDate) {
                                        blnReadOnly = true;
                                    }
                                }
                                else {
                                    if ((intervalStartDate >= taskStartDate && intervalStartDate <= taskEndDate) || (intervalEndDate >= taskStartDate && intervalEndDate <= taskEndDate) || (taskStartDate >= intervalStartDate && taskStartDate <= intervalEndDate) || (taskEndDate >= intervalStartDate && taskEndDate <= intervalEndDate)) {
                                        blnReadOnly = false;
                                    }
                                    else {
                                        blnReadOnly = true;
                                    }
                                }
                            }
                        }

                        if (blnReadOnly == true) {
                            $(this).attr("readonly", "readonly");
                        }
                        else {
                            $(this).removeAttr("readonly");
                        }
                    }
                });
                //User Calculation Start Here
            }
        }

        function checkIfValueChangedOrNot(ele) {
            if ($(ele).val() != $(ele).attr("data-original")) {
                if ($(ele).hasClass("rm-dirty-hours") == false) {
                    $(ele).addClass("rm-dirty-hours");
                }
            }
            else {
                $(ele).removeClass("rm-dirty-hours");
            }
        }


        //---------------------------------
        // PUBLIC properties and methods
        //---------------------------------
        return {

            /**
            * Initialize the view elements
            * @return {boolean}
            */
            init: function () {

                // Configure window event for prevent page change
                var previous_onbeforeunload = window.onbeforeunload;
                window.onbeforeunload = function () {
                    if (model.isChanged()) {
                        return utils.T('You have unsaved data. Are you sure you want to leave this page?');
                    }
                    if (previous_onbeforeunload) {
                        return previous_onbeforeunload();
                    }
                };

                //-------------------------------
                // Get root element
                //-------------------------------
                $root = $($('#' + settings.element)[0]);
                if ($root.length === 0) {
                    utils.DebugError('Don\'t found elements with "' + settings.element + '" id.');
                    return false;
                }
                $root.html('');

                //-------------------------------
                // Check and add CSS
                //-------------------------------
                //utils.checkCSS(NAME + '.css');

                // Add basic css class
                $root.addClass(NAME);

                // Add readonly css class
                if (settings.readonly) {
                    $root.addClass('tc-readonly');
                }

                //-------------------------------
                // Project
                //-------------------------------
                $project = $('<div class="rem-grid" id="divProjects"></div>').appendTo($root);
                $projectHeader = $('<div class="rem-header"></div>').appendTo($project);
                $projectSubHeader = $('<div class="rem-sub-header"></div>').appendTo($project);
                $projectBody = $('<div class="rem-body" style="height:210px;"></div>').appendTo($project);
                $projectScroll = $('<div style="position:relative"></div>').appendTo($project);


                $projectHeaderLeft = $('<div class="rem-left" id="divProjectHeaderLeft">' +
                    '<div style="position:relative;"><div style="position:absolute; left:13px; top:11px; "><img src="../ResourceManagementControl/images/ar-big.png" class="arrowUpImageProject"  datatype="project" isHidden="false" datatype="project"/></div></div>' +
                    '<h3>' + utils.T('Projects &amp; Services') + '</h3>' +

                    '</div>').appendTo($projectHeader);
                $projectHeaderRight = $('<div class="rem-right" id="divProjectHeaderRight"></div>').appendTo($projectHeader);
                $projectHeaderIntervals = $('<div class="rem-months scrollWidth" style=" overflow:hidden; "></div>').appendTo($projectHeaderRight);

                //For scroll
                $projectScrollLeft = $('<div style="width:385px" id="divProjectScrollLeft"></div>').appendTo($projectScroll);
                $projectScrollRight = $('<div style="position:absolute;left:385px;overflow:hidden;right:0" id="divProjectScrollRight"></div>').appendTo($projectScroll);
                $projectScrollRightContent = $('<div style="height:16px" class="scrollWidth"></div>').appendTo($projectScrollRight);

                $projectSubHeaderLeft = $('<div class="rem-subleft" id="divProjectSubHeaderLeft"></div>').appendTo($projectSubHeader);
                $projectSubHeaderRight = $('<div class="rem-subright" id="divProjectSubHeaderRight"></div>').appendTo($projectSubHeader);

                var headerTotals = '<table><tr>';
                if (settings.gap.visible) {
                    headerTotals += '<td class="total-value" id="tdTotalValue">0%</td>';
                }

                headerTotals +=  '<td>' + utils.T('TOTAL DEMAND') + '<span id="spnTotalDemand">00:00h</span></td>';
                if (settings.allocated.visible) {
                    headerTotals += '<td>' + utils.T('TOTAL ALLOCATED') + '<span id="spnTotalAllocated">00:45h</span></td>';
                }
                if (settings.gap.visible) {
                    headerTotals += '<td>' + utils.T('TOTAL GAP') + '<span id="spnTotalGap">00:15h</span></td>';
                }
                headerTotals += '</tr>' +
                    '</table>';
                $projectSubHeaderLeft.append(headerTotals);


                $projectBodyLeft = $('<div class="rem-bodyleft" id="divProjectBodyLeft"></div>').appendTo($projectBody);
                $projectBodyRight = $('<div class="rem-bodyright" id="divProjectBodyRight"></div>').appendTo($projectBody);

                $projectHeaderRightContent = $('<div class="rem-months scrollWidth" style="overflow:hidden;"></div>').appendTo($projectHeaderRight);
                $projectSubHeaderRightContent = $('<div class="rem-chartdata scrollWidth" style="overflow:hidden;"></div>').appendTo($projectSubHeaderRight);
                $projectBodyRightContent = $('<div style="overflow:hidden" class="scrollWidthBody" id="divProjectBodyRightContent"></div>').appendTo($projectBodyRight);



                $('<br>').appendTo($root);
                //-------------------------------
                // Profile-Users
                //-------------------------------
                $user = $('<div class="rem-grid" id="divUsers" style="display:none; margin-top:3px"></div>').appendTo($root);
                $userHeader = $('<div class="rem-header"></div>').appendTo($user);
                $userBody = $('<div class="rem-body" style="height:245px;"></div>').appendTo($user);
                $userScroll = $('<div style="position:relative"></div>').appendTo($user);

                $userHeaderLeft = $('<div class="rem-left" id="divUserHeaderLeft">' +
                    '<div style="position:relative;"><div style="position:absolute; left:13px; top:11px; "><img src="../ResourceManagementControl/images/ar-big.png" class="arrowUpImageProject" datatype="user" isHidden="false" datatype="project"/></div></div>' +
                    '<h3>' + utils.T('Professional categories/Users') + '</h3>' +
                    '</div>').appendTo($userHeader);
                $userHeaderRight = $('<div class="rem-right" id="divUserHeaderRight"></div>').appendTo($userHeader);
                $userHeaderIntervals = $('<div class="rem-months scrollWidth" style=" overflow:hidden; "></div>').appendTo($userHeaderRight);


                $userBodyLeft = $('<div class="rem-bodyleft" id="divUserBodyLeft"></div>').appendTo($userBody);
                $userBodyRight = $('<div class="rem-bodyright" id="divUserBodyRight"></div>').appendTo($userBody);

                $userHeaderRightContent = $('<div class="rem-months scrollWidth" style=" overflow:hidden; "></div>').appendTo($userHeaderRight);
                $userBodyRightContent = $('<div style=" overflow:hidden" class="scrollWidthBody" id="divUserBodyRightContent"></div>').appendTo($userBodyRight);
                //For scroll
                //                $userScrollLeft = $('<div style="width:370px" id="divUserScrollLeft"></div>').appendTo($userScroll);
                //                $userScrollRight = $('<div style="position:absolute;left:370px;overflow:auto;right:0" id="divUserScrollRight"></div>').appendTo($userScroll);
                //                $userScrollRightContent = $('<div style="height:5px" class="scrollWidth"></div>').appendTo($userScrollRight);

                //$user = $('').appendTo($root);
                //$addResourcePopup = $('').appendTo($root);
                //$addCategoryPopup = $('').appendTo($root);

                $(".arrowUpImageProject").click(function () {
                    var divID = "divUsers";
                    if ($(this).attr("datatype") == "project") {
                        divID = "divProjects";

                    }

                    if ($(this).attr("isHidden") == "false") {
                        $("#" + divID + " .rem-sub-header, #" + divID + " .rem-body").slideUp();
                        $(this).attr("isHidden", "true");
                        $(this).attr("src", "../ResourceManagementControl/images/ar-big-close.png");
                    } else {
                        $("#" + divID + " .rem-sub-header, #" + divID + " .rem-body").slideDown();
                        $(this).attr("isHidden", "false");
                        $(this).attr("src", "../ResourceManagementControl/images/ar-big.png");
                    }

                    setTimeout(function () {
                        adjustVerticalHeight();
                        parent.calcHeight();
                    }, 850);
                });

                $("#drpItemsToShow").change(function () {

                    adjustVerticalHeight();
                    resourceSearchSave();
                });

                /* All page level events start here */
                $("body").delegate(".rem-setting", "click", function () {
                    projectId = parseInt($(this).attr("projectid"));

                    if ($(this).attr("data-popup").toLowerCase() == "task") {
                        taskId = parseInt($(this).attr("taskid"));
                        parentTaskId = parseInt($(this).attr("parenttaskid"));
                        openTaskPopup(taskId, $("div[id$=task_" + taskId + "] .spnTaskName:eq(0) a").attr("href"));
                    } else {
                        var resourceType = '',
                            categoryId = '',
                            categoryType = '',
                            selectedProjectUsers = '',
                            selectedUsersForCategory = '';
                        var oTask = {},
                            oTaskCheck,
                            isGetTasks = true;
                        if ($(this).attr("data-popup").toLowerCase() == "project") {
                            resourceType = 'project';
                            selectedProjectUsers = getSelectedUsersOfProject($(this).attr("projectid"));
                            $("#divAddResource").find(".rem-close").attr("data-popup", "project-resources");
                        } else if ($(this).attr("data-popup").toLowerCase() == "category-resource") {
                            resourceType = 'category';
                            categoryId = $(this).attr("categoryid");
                            categoryType = $(this).attr("categorytype");
                            taskId = parseInt($(this).attr("taskid"));
                            parentTaskId = parseInt($(this).attr("parenttaskid"));
                            selectedUsersForCategory = getSelectedUsersOfProject($(this).attr("projectid"));
                            $("#divAddResource").find(".rem-close").attr("data-popup", "category-resources");
                            projectData = {};
                            projectData.ProjectId = projectId;
                            projectData.ProjectName = $("#project_" + projectId + " .spnProjectName a").text();
                            projectData.RedirectURL = $("#project_" + projectId + " .spnProjectName a").attr("href");
                            projectData.ProjectMethodType = parseInt($("#project_" + projectId + " .imgProjectMethodType").attr("data-projectmethodtype"));

                            //                            taskData = {};
                            //                            taskData.TaskId = taskId;
                            //                            taskData.TaskKind = 3;
                            //                            taskData.TaskName = $("div[id$=task_" + taskId + "] .spnTaskName:eq(0) a").text();
                            //                            taskData.RedirectURL = $("div[id$=task_" + taskId + "] .spnTaskName:eq(0) a").attr("href");

                            if (popupTasks.length > 0) {
                                oTaskCheck = $.grep(popupTasks, function (e) {
                                    return e.TaskId == taskId
                                });
                                if (oTaskCheck.length > 0) {
                                    oTask = oTaskCheck[0];
                                    isGetTasks = false;
                                    taskData = JSON.parse(JSON.stringify(oTask));
                                }
                            }

                            if (isGetTasks) {
                                $.ajax({
                                    type: "POST",
                                    url: settings.URLTaskDetails,
                                    data: JSON.stringify({
                                        intTaskId: taskId
                                    }),
                                    contentType: "application/json; charset=utf-8",
                                    dataType: "json",
                                    success: function (msg) {

                                        try {
                                            var objJson = JSON.parse(msg.d)[0];

                                            taskData = JSON.parse(JSON.stringify(objJson));
                                            taskData.RedirectURL = $("div[id$=task_" + taskId + "] .spnTaskName:eq(0) a").attr("href");

                                            if (objJson.TaskId > 0) {

                                                oTask = {};
                                                oTask = JSON.parse(JSON.stringify(taskData));
                                                oTask.oldTaskName = oTask.TaskName;


                                                if (popupTasks.length > 0) {
                                                    oTaskCheck = $.grep(popupTasks, function (e) {
                                                        return e.TaskId == objJson.TaskId
                                                    });
                                                    if (oTaskCheck.length > 0) {
                                                        oTask = oTaskCheck[0];
                                                    } else {
                                                        popupTasks.push(oTask);
                                                    }
                                                } else {
                                                    popupTasks.push(oTask);
                                                }

                                                var dialog = $("#divAddResourceBody").userList(1, selectedProjectUsers, strCurrentCulture, projectId, resourceType, selectedUsersForCategory, categoryId, categoryType, function (selectedUsers, isCancelled) {
                                                    if (isCancelled == false) {
                                                        if (resourceType.toLowerCase() == 'project') {
                                                            var objSelectedProjectUsers = {};
                                                            objSelectedProjectUsers.ProjectId = projectId;
                                                            objSelectedProjectUsers.SelectedUsers = JSON.parse(JSON.stringify(selectedUsers));
                                                            var chk = $.grep(lstSelectedProjectUsers, function (e) {
                                                                return e.ProjectId == projectId
                                                            });
                                                            if (chk.length > 0) {
                                                                chk[0].SelectedUsers = JSON.parse(JSON.stringify(selectedUsers));
                                                            } else {
                                                                lstSelectedProjectUsers.push(objSelectedProjectUsers);
                                                            }
                                                        }
                                                        else if (resourceType.toLowerCase() == 'category') {
                                                            //this.selectedUsers = JSON.parse(JSON.stringify(selectedUsers));
                                                            view.setSelectedUsers(selectedUsers);
                                                            addResourcesInBothPanel();
                                                            setTimeout(function () {
                                                                adjustVerticalHeight();
                                                                parent.calcHeight();
                                                            }, 250);
                                                        }
                                                    }
                                                    //$(".rem-overlay").hide();
                                                    $("#divAddResourceBody").html("");
                                                    $("#divAddResource").fadeOut();
                                                });
                                                $("#divAddResource").fadeIn();
                                                return false;
                                            }
                                        } catch (ex) {
                                            //Some issue occurred while fetching task details.
                                        }
                                    }
                                });
                            }
                        }
                        $("#divAddResourceBody").html("");

                        if (resourceType.toLowerCase() != "category" || isGetTasks == false) {
                            var dialog = $("#divAddResourceBody").userList(1, selectedProjectUsers, strCurrentCulture, $(this).attr("projectid"), resourceType, selectedUsersForCategory, categoryId, categoryType, function (selectedUsers, isCancelled) {
                                if (isCancelled == false) {
                                    if (resourceType.toLowerCase() == 'project') {
                                        var objSelectedProjectUsers = {};
                                        objSelectedProjectUsers.ProjectId = projectId;
                                        objSelectedProjectUsers.SelectedUsers = JSON.parse(JSON.stringify(selectedUsers));
                                        var chk = $.grep(lstSelectedProjectUsers, function (e) {
                                            return e.ProjectId == projectId
                                        });
                                        if (chk.length > 0) {
                                            chk[0].SelectedUsers = JSON.parse(JSON.stringify(selectedUsers));
                                        } else {
                                            lstSelectedProjectUsers.push(objSelectedProjectUsers);
                                        }
                                    }
                                    else if (resourceType.toLowerCase() == 'category') {
                                        //this.selectedUsers = JSON.parse(JSON.stringify(selectedUsers));
                                        view.setSelectedUsers(selectedUsers);
                                        addResourcesInBothPanel();
                                    }
                                }
                                //$(".rem-overlay").hide();
                                $("#divAddResourceBody").html("");
                                $("#divAddResource").fadeOut();
                            });
                            $("#divAddResource").fadeIn();
                            return false;
                        }
                    }
                });

                $("body").delegate("#btnAddCategories", "click", function () {
                    openCategoryPopup();
                    return false;
                });


                $("body").delegate(".rem-close", "click", function () {
                    if ($(this).attr("data-popup") == "task") {
                        $(".rem-overlay").fadeOut();
                        $("#modelForTask").modal("hide");
                    } else if ($(this).attr("data-popup") == "categories") {
                        //$("#divAddCategory").fadeOut();
                        $("#divAddCategory").modal("hide");
                    } else {
                        $("#divAddResourceBody").html("");
                        $("#divAddResource").fadeOut();
                        if ($(this).attr("data-popup") == "project-resources" || $(this).attr("data-popup") == "category-resources") {
                            $(".rem-overlay").fadeOut();
                        }

                    }
                });

                $("body").delegate("#btnCancelCategoryPopup", "click", function () {
                    //$("#divAddCategory").fadeOut();
                    $("#divAddCategory").modal("hide");
                    return false;
                });

                $("body").delegate("#btnSave", "click", function () {
                    var tempCategoryId = '';
                    selectedCategoriesWithType = '';
                    $("#divAddCategory").find("input[type=checkbox][name=categories]:checked").each(function () {
                        tempCategoryId = $(this).attr("id").split("_")[2];
                        selectedCategoriesWithType += tempCategoryId + "_ctype_" + $(this).closest("tr").find("input[type=radio]:checked").val() + ",";
                    });
                    //$("#divAddCategory").fadeOut();
                    $("#divAddCategory").modal("hide");
                    return false;
                });

                $("body").delegate("#btnSaveTask", "click", function () {

                    var tempId = "project_" + projectId,
                        divCategoryId = '',
                        arrCategories = selectedCategoriesWithType.split(","),
                        objCategory = {},
                        objTempCategory = {},
                        categoryType = '',
                        newTaskIdForUser = '',
                        userImage = '',
                        $ele = null,
                        projectMethodTypeImage = '',
                        parentElementId = '',
                        objMain = {},
                        objUser = {},
                        objProject = {},
                        objTask = {},
                        tempTaskId = "project_" + projectId,
                        strSetting = '';
                    if (parentTaskId != 0) {
                        tempTaskId += "_parenttask_" + parentTaskId;
                    }
                    tempTaskId += "_task_" + taskId;

                    $("#" + tempTaskId + " .spnTaskName a").text($("#txtTaskName").val());
                    var opTask = null;
                    if (popupTasks.length > 0) {
                        opTask = $.grep(popupTasks, function (e) {
                            return e.TaskId == taskId
                        });
                    }

                    if ($("#txtTaskName").val().toLowerCase() != $("#hdnTaskName").val().toLowerCase() ||
                        $("#txtStartDate").val() != $("#hdnStartDate").val() ||
                        $("#txtEndDate").val() != $("#hdnEndDate").val()) {
                        if (popupTasks.length > 0) {
                            var opTask = $.grep(popupTasks, function (e) {
                                return e.TaskId == taskId
                            });
                            if (opTask.length > 0) {
                                opTask[0].TaskName = $("#txtTaskName").val();
                                opTask[0].TaskStartDate = $("#txtStartDate").val();
                                opTask[0].TaskEndDate = $("#txtEndDate").val();
                            }
                            setReadonlyAfterTaskChanged();
                        }
                    }


                    //Add data of category starts
                    for (var i = 0; i < arrCategories.length - 1; i++) {
                        objCategory = {};

                        objCategory.CategoryId = parseInt(arrCategories[i].split("_")[0]);
                        objTempCategory = $.grep(categoryData, function (e) {
                            return e.CategoryId == objCategory.CategoryId
                        });
                        if (objTempCategory.length > 0) {
                            objCategory.CategoryName = objTempCategory[0].CategoryName;
                            divCategoryId = '';
                            objCategory.CategoryType = parseInt(arrCategories[i].split("_")[2]);
                            objCategory.Efforts = [];
                            if (opTask != null && opTask.length > 0) {
                                objCategory.TaskStartDate = opTask[0].TaskStartDate;
                                objCategory.TaskEndDate = opTask[0].TaskEndDate;
                            }
                            divCategoryId = tempTaskId + "_Category_" + arrCategories[i];
                            categoryType = GetCategoryType(objCategory.CategoryType);

                            strSetting = '<a href="#"  taskid="' + taskId + '" projectid="' + projectId + '" parenttaskid="' + parentTaskId + '"  categoryid="' + objCategory.CategoryId + '" categorytype="' + objCategory.CategoryType + '" class="rem-rowlink rem-setting"  data-popup="category-resource" title="' + utils.T('Add resources to task') + '"><img src="../ResourceManagementControl/images/cogwheel.svg" alt="" width="16px" height="16px"/></a>';

                            if ($("#" + divCategoryId).length == 0) {
                                $('<div class="rem-row row4 rem-row-project-category" id="' + divCategoryId + '" datatype="category" categoryid="' + objCategory.CategoryId + '" categorytype="' + objCategory.CategoryType + '" taskid="' + taskId + '">' + objCategory.CategoryName + ' (' + categoryType + ') ' + strSetting + '</div>').insertAfter($("div[id^=" + tempTaskId + "_]:last"));
                                bindIntervalValues(4, objCategory, taskId, divCategoryId, true);
                            }

                            objMain = getDataFromJSON("project", "task", objCategory.CategoryId, projectId, taskId, 0, objCategory.CategoryType);
                            if (objMain != null) {
                                objMain.Categories.push(objCategory);
                            }
                        }
                    }
                    //Add data of category ends

                    //Add data of task details change starts

                    addResourcesInBothPanel();
                    //Add data of task details change ends

                    $("#modelForTask").modal("hide")
                    adjustVerticalHeight();
                    parent.calcHeight();
                    setTimeout(function () {
                        setRoundHour();
                    }, 250);
                    return false;
                });

                $("body").delegate(".arrowUpImage", "click", function () {
                    var id = $(this).closest("div").attr("id"),
                        idOfBody = '',
                        currentElement = $(this),
                        cls = $(this).attr("data-row-class"),
                        childCls = "row" + (parseInt(cls.replace("row", "")) + 1);
                    if ($(this).attr("datatype") == "project") {
                        idOfBody = id.replace("project", "project_intervals");
                    } else {
                        idOfBody = id.replace("category", "category_intervals");
                    }
                    if ($(this).attr("isHidden") == "false") {
                        $("div[id^=" + id + "_]").slideUp();
                        $(this).attr("src", "../ResourceManagementControl/images/ar-small-close.png");
                        $(this).attr("isHidden", "true");
                        $("div[id^=" + id + "_] .arrowUpImage").attr("isHidden", "true");
                        $("div[id^=" + id + "_] .arrowUpImage").attr("src", "../ResourceManagementControl/images/ar-small-close.png");
                        if (id.indexOf("project_") == 0) {
                            $("div[id^=" + id.replace("project_", "project_intervals_") + "_]").slideUp();
                        } else {
                            $("div[id^=" + id.replace("category_", "category_intervals_") + "_]").slideUp();
                        }

                        setTimeout(function () {
                            if ($("#" + idOfBody).closest(".scrollWidthBody").height() < $(currentElement).closest(".rem-body").height()) {
                                $("#" + idOfBody).closest(".scrollWidthBody").width(scrollWidth);
                            }
                        }, 250);
                    } else {
                        if ($("div[id^=" + id + "_]." + childCls).length == 0) {
                            childCls = "row" + (parseInt(childCls.replace("row", "")) + 1);
                        }
                        $("div[id^=" + id + "_]." + childCls).slideDown();
                        $(this).attr("src", "../ResourceManagementControl/images/ar-small.png");
                        $(this).attr("isHidden", "false");
                        $("div[id^=" + id + "_]." + childCls + " .arrowUpImage").attr("isHidden", "true");
                        $("div[id^=" + id + "_]." + childCls + " .arrowUpImage").attr("src", "../ResourceManagementControl/images/ar-small-close.png");
                        if (id.indexOf("project_") == 0) {
                            var intervalId = ''
                            $.each($("div[id^=" + id + "_]." + childCls), function (i, ele) {
                                intervalId = $(this).attr("id").replace("project_", "project_intervals_");
                                $("#" + intervalId).slideDown();
                            });
                            //$("div[id^=" + id.replace("project_", "project_intervals_") + "_]").slideUp();
                        } else {
                            $.each($("div[id^=" + id + "_]." + childCls), function (i, ele) {
                                intervalId = $(this).attr("id").replace("category_", "category_intervals_");
                                $("#" + intervalId).slideDown();
                            });
                            //$("div[id^=" + id.replace("category_", "category_intervals_") + "_]").slideUp();
                        }

                        setTimeout(function () {
                            if ($("#" + idOfBody).closest(".scrollWidthBody").height() > $(currentElement).closest(".rem-body").height()) {
                                $("#" + idOfBody).closest(".scrollWidthBody").width(scrollWidth);
                            }
                        }, 250);

                    }

                    setTimeout(function () {
                        adjustVerticalHeight();
                        parent.calcHeight();
                    }, 450);


                });

                $("body").delegate(".sty4", "change", function () {
                    //                    if ($("#drpIntervals").val() != 1 && isConfirmDemandAllocationChange == false) {
                    //                        var res = confirm(utils.T("When changing values for the interval of week, month or quarter, your manual day entries will be overwritten. Do you want to continue?"));
                    //                        if (res) {
                    //                            isConfirmDemandAllocationChange = true;
                    //                        } else {
                    //                            $(this).val($(this).attr("data-old"));
                    //                        }
                    //                    }
                    if ($(this).attr("datamembertype") != null) {
                        var gap = 0,
                            obj = null;
                        if ($(this).attr("datamembertype") == "user") {

                            /**************** For Calculate Category Data Based on User Allocation ****************/
                            var categoryid = parseInt($(this).attr("categoryid"));
                            var intervalIdentity = parseInt($(this).attr("intervalidentity"));
                            var taskid = parseInt($(this).attr("taskid"));
                            var currentElement = $(this);
                            var categoryType = $(this).attr("categoryType");
                            var projectid = parseInt($(this).attr("projectid"));
                            var allocated = 0;
                            if ($("input[datamembertype='category-allocated'][categoryid='" + categoryid + "'][taskid='" + taskid + "'][intervalIdentity='" + intervalIdentity + "'][categoryType='" + categoryType + "']") != null) {
                                var parentElementId = $(this).parent().parent().parent()[0].id.replace('_task_' + taskid, '');
                                var childTasks = $('[id^=' + parentElementId + '_]').find('[intervalidentity="' + intervalIdentity + '"][taskid="' + taskid + '"][categoryid="' + categoryid + '"][categoryType="' + categoryType + '"][datamembertype="user"]');
                                var allUserAllocated = $('[id^=category_intervals_' + categoryid + '_ctype_' + categoryType + ']').find('[intervalidentity="' + intervalIdentity + '"][taskid="' + taskid + '"][categoryid="' + categoryid + '"][categorytype="' + categoryType + '"][datamembertype="user"]');
                                setTimeout(function () {

                                    var demand = getNumberFromString($("input[datamembertype='category-demand'][categoryid='" + categoryid + "'][taskid='" + taskid + "'][intervalIdentity='" + intervalIdentity + "'][categoryType='" + categoryType + "']").val());
                                    var isDemandUpdated = false;
                                    allocated = getNumberFromString($(currentElement).val());

                                    //if (parentElementId.lastIndexOf('parenttask') != -1) {

                                    var totalHours = 0.00;
                                    allUserAllocated.each(function (element) {
                                        totalHours += parseFloat(getNumberFromString($(this).val()));
                                    });

                                    if (totalHours > demand) {
                                        $("input[datamembertype='category-demand'][categoryid='" + categoryid + "'][taskid='" + taskid + "'][intervalIdentity='" + intervalIdentity + "'][categoryType='" + categoryType + "']").val(setHoursFormat(totalHours));
                                        $("input[datamembertype='category-demand'][categoryid='" + categoryid + "'][taskid='" + taskid + "'][intervalIdentity='" + intervalIdentity + "'][categoryType='" + categoryType + "']").attr("data-old", setHoursFormat(totalHours));
                                        isDemandUpdated = true;
                                        updateParentDemandValue($("input[datamembertype='category-demand'][categoryid='" + categoryid + "'][taskid='" + taskid + "'][intervalIdentity='" + intervalIdentity + "'][categoryType='" + categoryType + "']"));

                                        checkIfValueChangedOrNot($("input[datamembertype='category-demand'][categoryid='" + categoryid + "'][taskid='" + taskid + "'][intervalIdentity='" + intervalIdentity + "'][categoryType='" + categoryType + "']"));
                                        //                                        displayMessage(utils.T("Allocated value can not exceed then the demand"), true)
                                        //                                        return false;
                                    }



                                    $(currentElement).attr("data-old", setHoursFormat(allocated));

                                    $("input[datamembertype='category-allocated'][categoryid='" + categoryid + "'][taskid='" + taskid + "'][intervalIdentity='" + intervalIdentity + "'][categoryType='" + categoryType + "']").val(setHoursFormat(totalHours));

                                    gap = demand - totalHours;
                                    gap = gap < 0 ? 0 : gap;
                                    var cls = getCSSClassForGapField(gap);
                                    $("input[datamembertype='category-gap'][categoryid='" + categoryid + "'][taskid='" + taskid + "'][intervalIdentity='" + intervalIdentity + "'][categoryType='" + categoryType + "']").val(setHoursFormat(gap)).removeClass("sty1").removeClass("sty2").addClass(cls);

                                    updateCategoryParentAllocated(currentElement);

                                    obj = getDataFromJSON("category", "task", categoryid, projectid, taskid, parseInt(parentElementId.split("_")[6]), categoryType);

                                    if (obj != null && obj.Efforts != null && obj.Efforts.length > 0) {
                                        var objEffort = $.grep(obj.Efforts, function (e) {
                                            return e.IntervalIdentity == intervalIdentity
                                        });
                                        if (objEffort.length > 0) {
                                            objEffort[0].Allocated = allocated;
                                        } else {
                                            objEffort = {}
                                            objEffort.Allocated = allocated;
                                            objEffort.IntervalIdentity = intervalIdentity;
                                            if (obj.Efforts == undefined) {
                                                obj.Efforts = [];
                                            }
                                            obj.Efforts.push(objEffort);
                                        }
                                    } else {
                                        objEffort = {}
                                        objEffort.Allocated = allocated;
                                        objEffort.IntervalIdentity = intervalIdentity;
                                        if (obj.Efforts == undefined) {
                                            obj.Efforts = [];
                                        }
                                        obj.Efforts.push(objEffort);
                                    }

                                    obj = null;

                                    obj = getDataFromJSON("project", "category", categoryid, projectid, taskid, 0, categoryType);
                                    if (obj != null && obj.Efforts != null && obj.Efforts.length > 0) {
                                        var objEffort = $.grep(obj.Efforts, function (e) {
                                            return e.IntervalIdentity == intervalIdentity
                                        });
                                        if (objEffort.length > 0) {
                                            objEffort[0].Allocated = totalHours;
                                            if (isDemandUpdated) {
                                                objEffort[0].Demand = totalHours;
                                            }
                                        } else {
                                            objEffort = {}
                                            objEffort.Allocated = totalHours;
                                            if (isDemandUpdated) {
                                                objEffort.Demand = totalHours;
                                            }
                                            else {
                                                objEffort.Demand = 0.0;
                                            }
                                            objEffort.IntervalIdentity = intervalIdentity;
                                            if (obj.Efforts == undefined) {
                                                obj.Efforts = [];
                                            }
                                            obj.Efforts.push(objEffort);
                                        }
                                    } else {
                                        objEffort = {}
                                        objEffort.Allocated = totalHours;
                                        if (isDemandUpdated) {
                                            objEffort.Demand = totalHours;
                                        }
                                        else {
                                            objEffort.Demand = 0.0;
                                        }
                                        objEffort.IntervalIdentity = intervalIdentity;
                                        if (obj.Efforts == undefined) {
                                            obj.Efforts = [];
                                        }
                                        obj.Efforts.push(objEffort);
                                    }


                                    if ($("input[datamembertype='category-allocated'][categoryid='" + categoryid + "'][taskid='" + taskid + "'][intervalIdentity='" + intervalIdentity + "'][categoryType='" + categoryType + "']").length > 0)
                                        updateParentAllocatedValue($("input[datamembertype='category-allocated'][categoryid='" + categoryid + "'][taskid='" + taskid + "'][intervalIdentity='" + intervalIdentity + "'][categoryType='" + categoryType + "']"));

                                    calculateFinalTotal();
                                    checkIfValueChangedOrNot(currentElement);
                                }, 150);
                            }
                        } else {
                            var categoryid = parseInt($(this).attr("categoryid"));
                            var intervalIdentity = parseInt($(this).attr("intervalidentity"));
                            var taskid;
                            if ($(this).attr("taskid") !== 'undefined') {
                                taskid = parseInt($(this).attr("taskid"));
                            } else {
                                taskid = undefined;
                            }
                            var demand = 0.00;
                            var thisTextBox = $(this);
                            var categoryType = $(this).attr("categorytype");
                            var projectId = $(this).attr("projectid");

                            var categoryAllocated = $("input[datamembertype='category-allocated'][categoryid='" + categoryid + "'][taskid='" + taskid + "'][intervalIdentity='" + intervalIdentity + "'][categorytype='" + categoryType + "']");
                            var categoryGap = $("input[datamembertype='category-gap'][categoryid='" + categoryid + "'][taskid='" + taskid + "'][intervalIdentity='" + intervalIdentity + "'][categorytype='" + categoryType + "']");


                            setTimeout(function () {
                                demand = getNumberFromString($(thisTextBox).val());
                                if (categoryAllocated != null && categoryGap != null) {
                                    var allocated = getNumberFromString(categoryAllocated.val());

                                    if (demand < allocated) {
                                        $(thisTextBox).val($(thisTextBox).attr("data-old"));
                                        parent.displayResourceManagementMessage(utils.T("Demand cannot be less than the allocated capacity."), true)
                                        return false;
                                    }
                                    $(thisTextBox).attr("data-old", setHoursFormat(demand));

                                    gap = demand - allocated;
                                    gap = gap < 0 ? 0 : gap;
                                    categoryGap.val(setHoursFormat(gap));
                                    categoryGap.removeClass("sty1").removeClass("sty2").removeClass("sty4").addClass(getCSSClassForGapField(gap));
                                    obj = getDataFromJSON("project", "category", categoryid, projectId, taskid, 0, categoryType);

                                    if (obj != null && obj.Efforts != null && obj.Efforts.length > 0) {
                                        var objEffort = $.grep(obj.Efforts, function (e) {
                                            return e.IntervalIdentity == intervalIdentity
                                        });
                                        if (objEffort.length > 0) {
                                            objEffort[0].Demand = demand;
                                        } else {
                                            objEffort = {}
                                            objEffort.Demand = demand;
                                            objEffort.Allocated = 0;
                                            objEffort.IntervalIdentity = intervalIdentity;
                                            if (obj.Efforts == undefined) {
                                                obj.Efforts = [];
                                            }
                                            obj.Efforts.push(objEffort);
                                        }
                                    } else {
                                        objEffort = {}
                                        objEffort.Demand = demand;
                                        objEffort.Allocated = 0;
                                        objEffort.IntervalIdentity = intervalIdentity;
                                        if (obj.Efforts == undefined) {
                                            obj.Efforts = [];
                                        }
                                        obj.Efforts.push(objEffort);
                                    }

                                }
                                calculateFinalTotal();
                                updateParentDemandValue(thisTextBox);
                                checkIfValueChangedOrNot(thisTextBox);
                            }, 300);

                        }

                    }
                });

                //                $("body").delegate(".row4[datatype=category]", "mouseover", function () {
                //                    var id = $(this).attr("id"),
                //                        parentId = '';

                //                    parentId = getParentId(id);
                //                    parentId = getParentId(parentId);

                //                    $("#" + parentId + " a.rem-rowlink").show();
                //                });

                $("body").delegate(".row4[datatype=category]", "mouseout", function () {
                    var id = $(this).attr("id"),
                        parentId = '';

                    parentId = getParentId(id);
                    parentId = getParentId(parentId);

                    $("#" + parentId + " a.rem-rowlink").hide();
                });

                $("body").delegate("div[datatype=task], div[datatype=innertask]", "mouseover", function () {
                    var id = $(this).attr("id");


                    $("#" + id + " a.rem-rowlink").show();
                });

                $("body").delegate("div[datatype=task], div[datatype=innertask]", "mouseout", function () {
                    var id = $(this).attr("id");


                    $("#" + id + " a.rem-rowlink").hide();
                });

                $("#txtStartDate").change(function () {
                    if (checkIfStartDateIsGreaterThenEndDate() == false) {
                        if (popupTasks.length > 0) {
                            var objTask = $.grep(popupTasks, function (e) {
                                return e.TaskId == taskId
                            });
                            if (objTask.length > 0) {
                                $("#txtStartDate").val(objTask[0].TaskStartDate);
                            }
                        }
                        alert(utils.T("Start date should be less than end date"));
                    }
                });

                $("#txtEndDate").change(function () {
                    if (checkIfStartDateIsGreaterThenEndDate() == false) {
                        if (popupTasks.length > 0) {
                            var objTask = $.grep(popupTasks, function (e) {
                                return e.TaskId == taskId
                            });
                            if (objTask.length > 0) {
                                $("#txtEndDate").val(objTask[0].TaskEndDate);
                            }
                        }
                        alert(utils.T("Start date should be less than end date"));
                    }
                });

                $("body").delegate(".rem-row-project-category", "click", function () {
                    var cid = $(this).attr("categoryid"),
                        ctype = $(this).attr("categorytype"),
                        tid = $(this).attr("taskid"),
                        userCategoryTaskId = '';

                    if ($(".rem-row[id^=category_" + cid + "_ctype_" + ctype + "][id$=task_" + tid + "]").length > 0) {
                        userCategoryTaskId = $(".rem-row[id^=category_" + cid + "_ctype_" + ctype + "][id$=task_" + tid + "]").attr("id");
                        setCaretToPos($("#" + userCategoryTaskId + " input[data-type=user-allocated]"), 0);
                        showCategoryTask(userCategoryTaskId);
                        adjustVerticalHeight();

                        setTimeout(function () {
                            parent.calcHeight();
                            $("html,body", window.parent.document).animate({
                                scrollTop: $('#divUsers').offset().top
                            });


                        }, 250);



                        setTimeout(function () {
                            $("#" + userCategoryTaskId + ", #" + userCategoryTaskId.replace("category", "category_intervals")).addClass("row-hover", 1000);
                            $("#" + userCategoryTaskId + ", #" + userCategoryTaskId.replace("category", "category_intervals")).removeClass("row-hover", 2000);
                        }, 500);
                    }

                });

                $("body").delegate(".sty1[rowtype=category-row], .sty2[rowtype=category-row]", "click", function () {
                    var cid = $(this).attr("categoryid"),
                        ctype = $(this).attr("categorytype"),
                        tid = $(this).attr("taskid"),
                        userCategoryTaskId = '';

                    if ($(".rem-row[id^=category_" + cid + "_ctype_" + ctype + "][id$=task_" + tid + "]").length > 0) {
                        userCategoryTaskId = $(".rem-row[id^=category_" + cid + "_ctype_" + ctype + "][id$=task_" + tid + "]").attr("id");
                        setCaretToPos($("#" + userCategoryTaskId + " input[data-type=user-allocated]"), 0);
                        showCategoryTask(userCategoryTaskId);
                        adjustVerticalHeight();

                        setTimeout(function () {
                            parent.calcHeight();
                            $("html,body", window.parent.document).animate({
                                scrollTop: $('#divUsers').offset().top
                            }, 1500);


                        }, 250);



                        setTimeout(function () {
                            $("#" + userCategoryTaskId + ", #" + userCategoryTaskId.replace("category", "category_intervals")).addClass("row-hover", 1000);
                            $("#" + userCategoryTaskId + ", #" + userCategoryTaskId.replace("category", "category_intervals")).removeClass("row-hover", 2000);
                        }, 500);
                    }

                });

                return true;

            },
            /* End of Init() */

            /**
            * Show all elements loaded          
            */
            show: function () {

                popupTasks = [];
                lstSelectedProjectUsers = [];
                bindIntervals();

                bindProjectCategories();
                bindProjects();
                bindUserCategories();



                //adjustVerticalHeight();

                setTimeout(function () {
                    setRoundHour();
                    calculateFinalTotal();
                }, 500);

                if (model.data.Intervals != null && model.data.Intervals.length > 0) {
                    scrollWidth = (model.data.Intervals.length * 182);
                }

                $("div.scrollWidth").width(scrollWidth);
                $("div.scrollWidthBody").width(scrollWidth);
                setTimeout(function () { manageFancyHelp(); }, 500);
            },

            /**
            * Mark as saved control and remove dirty mark
            */
            saved: function () {
                popupTasks = [];
                lstSelectedProjectUsers = [];
                return true;
            },

            setSelectedUsers: function (selUsers) {
                selectedUsers = JSON.parse(JSON.stringify(selUsers));
            },

            getPopupTasks: function () {
                return popupTasks;
            },

            getText: function (txt) {
                return utils.T(txt);
            }
        };
    })();
    /* End of view */

    //=============================================================================
    //									 MODEL
    //=============================================================================
    //=============================================================================
    // Object:		model (static)
    // Scope:		private into teamctrl
    /**
    * model is an object to manage data.
    * @class
    */
    //=============================================================================
    var model = (function () {


        //---------------------------------
        // PRIVATE variables and functions
        //---------------------------------
        var oPublic = {}, // Private reference to public members
            oOriginal = {
                members: {},
                tasks: {}
            }; // Original data loaded with the control

        /**
        * prepare data and storage
        * @function
        * @parameter {object} data	
        * @return {boolean}
        */
        function storageData(data) {

            //------------------
            // Basic conversion
            //------------------
            if (typeof data === 'string') {
                oOriginal = JSON.parse(data);
            } else if (typeof data === 'object') {
                oOriginal = JSON.parse(JSON.stringify(data));
            } else {
                utils.DebugError('data: wrong format');
                return false;
            }

            //----------------------------------------
            // Copy Original to data and originalData
            //----------------------------------------
            oPublic.data = JSON.parse(JSON.stringify(oOriginal));
            oPublic.originalData = JSON.parse(JSON.stringify(oOriginal));
            return true;
        }
        /* End of StorateData() */

        function getLevel(cIdTask) {

        }

        //-------------------------------
        // PUBLIC properties and methods
        //-------------------------------

        /**
        * data property
        * @object
        */
        oPublic.data = {

        };
        /* End of model.data */

        /**
        * originalData property
        * @object
        */
        oPublic.originalData = {

        };
        /* End of model.originalData */

        /**
        * load data - public method
        * @function
        * @parameter {object} data	
        * @return {boolean}
        */
        oPublic.load = function () {
            $("#divShowMore").show();
            var bReturn = true;
            //--------------------------
            // Load data from parameter
            //--------------------------
            if (settings.data) {
                if (!storageData(settings.data)) {
                    return false;
                }
                return bReturn;

                //--------------------------
                // Load data from URL (ajax)
                //--------------------------
            } else if (settings.URLdata) {
                //$("#divShowMore").html('<img src="../images/msg_loder.gif" alt="" />');
                var headers = {};
                if (typeof userLoginToken !== 'undefined') {
                    headers["token"] = userLoginToken;
                }
                $.ajax({
                    cache: false,
                    async: true,
                    dataType: 'json',
                    headers: headers,
                    url: settings.URLdata,
                    error: function (jqXHR, textStatus, errorThrown) {
                        utils.DebugError('ERROR: ' + errorThrown);
                        bReturn = false;
                        enableDisableFilterControls(true);
                        $("#divShowMore").hide();
                        $(".trHide").show();
                    },
                    success: function (data) {
                        $("#tdTotalValue").val("0%");
                        $("#spnTotalDemand").text("00:00H");
                        $("#spnTotalAllocated").text("00:00H");
                        $("#spnTotalGap").text("00:00H");
                        $(".rem-row").remove();
                        $(".r-month").remove();
                        $(".rem-chartdata .rem-detail").remove();
                        setTimeout(function () {
                            $("#divShowMore").hide();
                            $(".trHide").show();
                        }, 150);
                        if (!storageData(data)) {
                            bReturn = false;
                        }
                        enableDisableFilterControls(true);

                        if ((typeof model.data.Project !== 'undefined' && model.data.Project.Categories.length > 0)
                            || (model.data.Categories != null && model.data.Categories.length > 0)
                            || (model.data.Projects != null && model.data.Projects.length > 0)) {
                            view.show();
                            //setRoundHour();
                            if (model.data.Project === undefined) {
                                $("#divUsers").show();
                                $("#tblResourceManagement").show();
                            }
                            $("#trBottom").show();
                            $("#divNoRecords").hide();
                            $("#divResourceManagement").show();
                            setTimeout(function () {
                                adjustVerticalHeight();
                                parent.calcHeight();
                                updatePerfectScrollbar();
                            }, 550);
                        }
                        else {
                            $("#divNoRecords").show();
                            $("#tblResourceManagement").css({ "min-height": "190px" });
                            $("#divResourceManagement").hide();
                            $("#trBottom").hide();
                            window.top.fancyhelp.remove('FancyHelpGroup');
                        }
                        setTimeout(function () { loadFirstTimeFancyNews(); }, 1000);
                    }
                });
                return bReturn;
            }
            return bReturn;
        };
        /* End of model.load() */



        /**
        * add, update or delete data
        * @function
        * @parameter {string} cEntity
        * @parameter {string} cAction
        * @parameter {string|object} cId
        * @parameter {object} oValues
        * @return {boolean}
        */
        oPublic.change = function (cEntity, cAction, cId, oValues) {
            var aTasks;
            var nCont;

            return false;
        };
        /* End of model.change() */

        /**
        * return the original data
        * @function
        * @return {object}
        */
        oPublic.getDataOriginal = function () {
            return JSON.parse(JSON.stringify(oOriginal));
        };
        /* End of model.getDataOriginal() */

        /**
        * return the actual data
        * @function
        * @return {object}
        */
        oPublic.getData = function () {
            return JSON.parse(JSON.stringify(oPublic.data));
        };
        /* End of model.getData() */

        /**
        * return the changed data
        * @function
        * @return {object}
        */
        oPublic.getChanges = function () {
            var oChange = {},
                oProject = {},
                oTask = {},
                oCategory = {},
                oUser = {},
                oTaskChange = {},
                oEffort = {},
                oCategoryChange = {},
                oTaskCheck = {},
                oCategoryCheck = {},
                isNewCategory = false,
                isNewUser = false,
                isNewProject = false,
                oUserChange = {},
                oEffortCheck = {},
                oEffortChange = {},
                isEffortChange = false,
                isDataChanged = false,
                popupTasks = [];

            oChange.ProjectUsers = [];
            oChange.Project = { Categories: [] };
            oChange.Categories = [];
            oChange.Users = [];
            oChange.Intervals = JSON.parse(JSON.stringify(model.data.Intervals));
            oChange.IntervalType = parseInt($("#drpIntervals").val());
            oChange.Tasks = [];

            popupTasks = view.getPopupTasks();

            if (lstSelectedProjectUsers.length > 0) {
                oChange.ProjectUsers = JSON.parse(JSON.stringify(lstSelectedProjectUsers));
            }

            $.each(model.data.Projects || [], function (i, objProject) {
                oProject = $.grep(model.originalData.Projects, function (e) {
                    return e.ProjectId == objProject.ProjectId
                })[0];
                if (objProject.Tasks.length > 0) {
                    $.each(objProject.Tasks, function (j, objTask) {
                        oTask = $.grep(oProject.Tasks, function (e) {
                            return e.TaskId == objTask.TaskId
                        })[0];
                        if (objTask.Categories != null && objTask.Categories.length > 0) {
                            $.each(objTask.Categories, function (k, objCategory) {
                                isDataChanged = false;
                                oTaskChange = {};
                                oTaskChange.TaskId = objTask.TaskId;
                                oTaskChange.Categories = [];
                                oCategoryChange = {};

                                oCategoryChange.CategoryId = objCategory.CategoryId;
                                oCategoryChange.CategoryType = objCategory.CategoryType;
                                oCategoryChange.Efforts = [];
                                oCategory = $.grep(oTask.Categories, function (e) {
                                    return e.CategoryId == objCategory.CategoryId && e.CategoryType == objCategory.CategoryType
                                });
                                if (oCategory.length == 0) {
                                    oCategoryChange.cmd = "add";
                                    oCategoryChange.Efforts = JSON.parse(JSON.stringify(objCategory.Efforts));
                                    isDataChanged = true;
                                    //If not a single record added in an object

                                } else {
                                    if (objCategory.Efforts != null && objCategory.Efforts.length > 0) {
                                        oCategory = oCategory[0];
                                        $.each(objCategory.Efforts, function (l, objEffort) {
                                            if (oCategory.Efforts != null && oCategory.Efforts.length > 0) {
                                                oEffort = $.grep(oCategory.Efforts, function (e) {
                                                    return e.IntervalIdentity == objEffort.IntervalIdentity
                                                });
                                                if (oEffort.length > 0) {
                                                    if (oEffort[0].Demand != objEffort.Demand || oEffort[0].Allocated != objEffort.Allocated) {
                                                        isDataChanged = true;
                                                        oCategoryChange.cmd = "edt";
                                                        oCategoryChange.Efforts.push(objEffort);
                                                    }
                                                } else {
                                                    oCategoryChange.cmd = "edt";
                                                    isDataChanged = true;
                                                    oCategoryChange.Efforts.push(objEffort);
                                                }
                                            }
                                        });
                                    }
                                }

                                if (isDataChanged) {
                                    if (oChange.Categories.length == 0) {
                                        oTaskChange.Categories.push(oCategoryChange);
                                        oChange.Categories.push(oTaskChange);
                                    } else {
                                        oTaskCheck = $.grep(oChange.Categories, function (e) {
                                            return e.TaskId == objTask.TaskId
                                        });
                                        if (oTaskCheck.length == 0) { // If task doesn't exist in an object
                                            oTaskChange.Categories.push(oCategoryChange);
                                            oChange.Categories.push(oTaskChange);
                                        } else { // If task exists then  add category in task
                                            oTaskChange = oTaskCheck[0];
                                            oCategoryCheck = $.grep(oTaskChange.Categories, function (e) {
                                                return e.CategoryId == objCategory.CategoryId && e.CategoryType == objCategory.CategoryType
                                            });
                                            if (oCategoryCheck.length == 0) {
                                                oTaskChange.Categories.push(oCategoryChange);
                                            }
                                        }
                                    }
                                }
                            });
                        }
                    });
                }
            });

            $.each((model.data.Project || { Categories: [] }).Categories, function (i, objCategory) {
                oCategory = $.grep(model.originalData.Project.Categories, function (e) {
                    return e.CategoryId == objCategory.CategoryId && e.CategoryType == objCategory.CategoryType
                });
                if (oCategory.length == 0) {
                    isNewCategory = true;
                } else {
                    isNewCategory = false;
                    oCategory = oCategory[0];
                }
                oCategoryChange = {};

                oCategoryChange.CategoryId = objCategory.CategoryId;
                oCategoryChange.CategoryType = objCategory.CategoryType;
                oCategoryChange.Efforts = [];
                $.each(objCategory.Efforts, function (l, objEffort) {
                    if (oCategory.Efforts != null && oCategory.Efforts.length > 0) {
                        oEffort = $.grep(oCategory.Efforts, function (e) {
                            return e.IntervalIdentity == objEffort.IntervalIdentity
                        });
                        if (oEffort.length > 0) {
                            if (oEffort[0].Demand != objEffort.Demand || oEffort[0].Allocated != objEffort.Allocated) {
                                isDataChanged = true;
                                oCategoryChange.cmd = "edt";
                                oCategoryChange.Efforts.push(objEffort);
                            }
                        } else {
                            oCategoryChange.cmd = "edt";
                            isDataChanged = true;
                            oCategoryChange.Efforts.push(objEffort);
                        }
                    } else {
                        oCategoryChange.cmd = "edt";
                        isDataChanged = true;
                        oCategoryChange.Efforts.push(objEffort);
                    }
                });
                if (isDataChanged) {
                    oChange.Project.Categories.push(oCategoryChange);
                }
            });
            $.each(model.data.Categories || [], function (i, objCategory) {
                isNewCategory = false;

                isNewProject = false;
                oCategory = $.grep(model.originalData.Categories, function (e) {
                    return e.CategoryId == objCategory.CategoryId && e.CategoryType == objCategory.CategoryType
                });
                if (oCategory.length == 0) {
                    isNewCategory = true;
                } else {
                    isNewCategory = false;
                    oCategory = oCategory[0];
                }
                $.each(objCategory.Users, function (j, objUser) {
                    isNewUser = true;
                    if (isNewCategory == false) {
                        oUser = $.grep(oCategory.Users, function (e) {
                            return e.UserId == objUser.UserId
                        });
                        if (oUser.length == 0) {
                            isNewUser = true;
                        } else {
                            isNewUser = false;
                            oUser = oUser[0];
                        }
                    }
                    $.each(objUser.Projects, function (k, objProject) {
                        isNewProject = true;
                        if (isNewCategory == false && isNewUser == false) {
                            oProject = $.grep(oUser.Projects, function (e) {
                                return e.ProjectId == objProject.ProjectId
                            });
                            if (oProject.length == 0) {
                                isNewProject = true;
                            } else {
                                isNewProject = false;
                                oProject = oProject[0];
                            }

                        }
                        $.each(objProject.Tasks, function (l, objTask) {
                            isEffortChange = false;
                            if (objTask.TaskKind != 2) {
                                if (isNewProject == false && oProject.Tasks != undefined && oProject.Tasks.length > 0) {
                                    oTask = $.grep(oProject.Tasks, function (e) {
                                        return e.TaskId == objTask.TaskId
                                    });
                                }

                                oTaskChange = {};
                                oTaskChange.TaskId = objTask.TaskId;
                                oTaskChange.cmd = (isNewCategory || isNewUser) ? "add" : "edt";
                                oTaskChange.Efforts = [];
                                oTaskChange.ProjectId = objProject.ProjectId;

                                if (oTask.length > 0) {
                                    oTaskCheck = oTask[0];
                                    if (objTask.Efforts != null && objTask.Efforts.length > 0) {
                                        $.each(objTask.Efforts, function (m, objEffort) {
                                            oEffortCheck = $.grep(oTaskCheck.Efforts, function (e) {
                                                return e.IntervalIdentity == objEffort.IntervalIdentity
                                            });
                                            if (oEffortCheck.length == 0 || (oEffortCheck.length > 0 && oEffortCheck[0].Allocated != objEffort.Allocated)) {
                                                oTaskChange.Efforts.push(objEffort);
                                                isEffortChange = true;
                                            }
                                        });
                                    }
                                }

                                if (isNewProject == true || isNewCategory == true || isNewUser == true || oTask.length == 0 || isEffortChange == true) {
                                    if (isNewProject == true || oTask.length == 0) {
                                        oTaskChange.Efforts = JSON.parse(JSON.stringify(objTask.Efforts));
                                    }
                                    oUserChange = {};
                                    oUserChange.UserId = objUser.UserId;
                                    oUserChange.Tasks = [];
                                    if (oChange.Users.length == 0) {
                                        oChange.Users.push(oUserChange);
                                    }
                                    oUserChange = $.grep(oChange.Users, function (e) {
                                        return e.UserId == objUser.UserId
                                    });
                                    if (oUserChange.length > 0) {
                                        oUserChange = oUserChange[0];
                                    } else {
                                        oUserChange = {};
                                        oUserChange.UserId = objUser.UserId;
                                        oUserChange.Tasks = [];
                                        oChange.Users.push(oUserChange);
                                        oUserChange = $.grep(oChange.Users, function (e) {
                                            return e.UserId == objUser.UserId
                                        })[0];
                                    }
                                    oUserChange.Tasks.push(oTaskChange);
                                }
                            }
                        });
                    });
                });
            });

            $.each(popupTasks, function (i, objPopupTask) {
                if (objPopupTask.TaskStartDate != objPopupTask.oldStartDate ||
                    objPopupTask.TaskEndDate != objPopupTask.oldEndDate ||
                    objPopupTask.TaskName != objPopupTask.oldTaskName) {
                    oTask = JSON.parse(JSON.stringify(objPopupTask));
                    oTask.TaskStartDate = convertToUniversalDatetimeFormat(objPopupTask.TaskStartDate);
                    oTask.TaskEndDate = convertToUniversalDatetimeFormat(objPopupTask.TaskEndDate);
                    oChange.Tasks.push(oTask);
                }
            });

            return oChange;
        };
        /* End of model.getData() */

        oPublic.isChanged = function (cEntity, cId) {
            var changes = oPublic.getChanges();
            if (changes.Project.Categories.length > 0 || changes.Categories.length > 0 || changes.Tasks.length > 0 || changes.Users.length > 0 || changes.ProjectUsers.length > 0) {
                return true;
            }
            return false;
        };

        /**
        * configure the control as all element saved;
        * @return {boolean}
        */
        oPublic.saved = function () {
            storageData(oPublic.data);

            return true;
        };
        /* End of model.saved() */




        //-------------------------------
        // Return the PUBLIC object
        //-------------------------------
        return oPublic;

    })();
    /* End of model */

    //=================================================
    // PUBLIC properties and methods
    //=================================================

    this.name = NAME;

    this.version = VERSION;


    this.debugmode = false;


    this.getDataOriginal = model.getDataOriginal;

    this.getData = model.getData;

    this.getChanges = model.getChanges;

    this.revertChanges = function () {
        if (settings.readonly) {
            return false;
        }
        model.saved();
        return true;
    };

    this.saved = function () {
        if (settings.readonly) {
            return false;
        }
        model.saved();
        view.saved();
        return true;
    };

    this.bindData = function (url) {
        settings.URLdata = url;
        model.data = {};
        model.originalData = {};

        setTimeout(function () {

            model.load();
        }, 150);

        //view.show();


    };

    this.setSelectedUsers = function (selectedUsers) {
        view.setSelectedUsers(JSON.parse(JSON.stringify(selectedUsers)));
    };

    this.isChanged = function () {
        return model.isChanged();
    };

    this.getText = function (txt) {
        return view.getText(txt);
    };

    //=================================================
    // CONSTRUCTOR
    //=================================================

    //----------------------
    // Normalize parameter
    //----------------------
    if (typeof oConfig === 'string') {
        settings = JSON.parse(oConfig);
    } else if (typeof oConfig === 'object') {
        settings = JSON.parse(JSON.stringify(oConfig));
    } else {
        settings = {};
    }

    //----------------
    // Default values
    //----------------
    settings = $.extend(true, {
        element: null,
        lang: 'en',
        culture: 'en-us',
        data: null,
        URLdata: null,
        URLusers: null,
        readonly: false,
        URLTaskDetails: null,
        URLGetCategories: null,
        allocated: { visible: true },
        gap: { visible: true }
    }, settings);

    //----------------
    // Check - path
    //----------------
    utils.PATH = settings.path || utils.PATH;

    //-------------------------
    // Check - element
    //-------------------------
    if (settings.element === null || settings.element === '') {
        var aElements = $('.' + NAME);
        if (aElements.length === 0) {
            utils.DebugError('Don\'t found elements with ' + NAME + ' class.');
            if (fEndCallback) {
                fEndCallback(utils.LastError, null);
            }
            return [];
        } else if (aElements.length === 1) {
            settings.element = $(aElements[0]).attr('id');
            if (!settings.element) {
                settings.element = NAME + '_' + String(Math.random()).split('.')[1];
                $(aElements[0]).attr('id', settings.element);
            }
        } else if (aElements.length > 1) {
            utils.DebugError('Found more than 1 elements with ' + NAME + ' class.');
            if (fEndCallback) {
                fEndCallback(utils.LastError, null);
            }
            return [];
        }

    }

    //-------------------------
    // Initialize view
    //-------------------------
    if (!view.init()) {
        if (fEndCallback) {
            fEndCallback(utils.LastError, null);
        }
        return [];
    }

    //-------------------------
    // Load data
    //-------------------------
    setTimeout(function () {
        if (!model.load()) {
            if (fEndCallback) {
                fEndCallback(utils.LastError, null);
            }
            return [];
        }
    }, 1500);    

    //-------------------------
    // Display view
    //-------------------------


    //-------------------------
    // Callback
    //-------------------------
    if (fEndCallback) {
        fEndCallback(utils.LastError, this);
    }


    //-------------------------
    // Return this object
    //-------------------------
    return this;

}

Date.prototype.addDays = function (days) {
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + days);
    return dat;
}
