import React, { useState, useMemo } from 'react';

// --- Reusable UI Components (Consolidated) ---

const NotesSection = ({ notes, isVisible }) => (
    <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isVisible ? 'max-h-[500px] mt-4' : 'max-h-0'}`}>
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-bold text-sm text-blue-800 mb-2">Compliance Notes</h4>
            <ul className="space-y-3">
                {notes.map((note, index) => (
                    <li key={index} className="flex items-start text-sm text-blue-900/90">
                        <svg className="w-4 h-4 mr-2 mt-0.5 text-blue-500 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A.75.75 0 0 0 10 12.5a.75.75 0 0 0 .75-.75v-.634a.25.25 0 0 1 .244.304l.459-2.066A.75.75 0 0 0 10 8.25H9Z" clipRule="evenodd" /></svg>
                        <span dangerouslySetInnerHTML={{ __html: note }} />
                    </li>
                ))}
            </ul>
        </div>
    </div>
);

const CreditVisualizer = ({ thresholds, calculatedPoints, pointsLabel = "Points" }) => (
    <div className="w-full">
        <h3 className="font-semibold text-gray-700 mb-2 text-center text-sm">Points Summary</h3>
        <div className="flex w-full rounded-lg border-2 border-gray-200 overflow-hidden shadow-inner bg-gray-50">
            {thresholds.map((level, index) => {
                const isAchieved = level.points <= calculatedPoints;
                const isCurrent = level.points === calculatedPoints;
                return (
                    <div key={level.points} className={`flex-1 p-3 text-center transition-all duration-300 ${index < thresholds.length - 1 ? 'border-r-2 border-gray-200' : ''} ${isCurrent ? 'bg-green-200 scale-105 shadow-lg z-10' : isAchieved ? 'bg-green-50' : 'bg-gray-50 opacity-60'}`}>
                        <div className={`text-xs md:text-sm font-semibold ${isAchieved ? 'text-green-800' : 'text-gray-500'}`}>{level.label}</div>
                        <div className={`text-2xl md:text-3xl font-bold mt-1 ${isAchieved ? 'text-green-900' : 'text-gray-600'}`}>{level.points}</div>
                    </div>
                );
            })}
        </div>
        <p className="text-center text-xs text-gray-500 mt-2">{pointsLabel}</p>
    </div>
);

const NextPointInsight = ({ shortfall, unit, message, isComplete, customMessage }) => {
    if (isComplete) {
        return (
            <div className="mt-4 flex items-center p-4 bg-green-100 rounded-lg border-l-4 border-green-500">
                <svg className="w-6 h-6 mr-3 text-green-600 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-sm font-semibold text-green-800">Congratulations! You've achieved the compliance for this measure.</p>
            </div>
        );
    }

    return (
        <div className="mt-4 flex items-start p-4 bg-blue-100/70 rounded-lg border-l-4 border-blue-500">
             <svg className="w-8 h-8 mr-3 text-blue-600 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div>
                 <p className="text-sm font-semibold text-blue-900" dangerouslySetInnerHTML={{
                     __html: `Next Point Insight: <span class="font-normal">${customMessage ? customMessage : `${message} <span class="font-bold">${shortfall > 0 ? shortfall.toFixed(0) : 0} more ${unit}</span> to achieve compliance.`}</span>`
                 }}>
                </p>
            </div>
        </div>
    );
};

const CardShell = ({ children, notes }) => {
    const [notesVisible, setNotesVisible] = useState(false);
    return (
        <div className="border border-gray-200 rounded-lg p-4 lg:p-6 flex flex-col h-full relative bg-white">
            <div className="flex-grow flex flex-col">{children}</div>
            {notes && notes.length > 0 && (
                <div className="mt-6 border-t border-gray-200 pt-4">
                    <button onClick={() => setNotesVisible(!notesVisible)} className="w-full flex justify-between items-center text-sm font-semibold text-blue-700 hover:text-blue-900 transition-colors">
                        <span>Compliance Notes</span>
                        <svg className={`w-5 h-5 transition-transform ${notesVisible ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" /></svg>
                    </button>
                    <NotesSection notes={notes} isVisible={notesVisible} />
                </div>
            )}
        </div>
    );
};

const Accordion = ({ title, points, maxPoints, isOpen, onToggle, children }) => (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
        <button onClick={onToggle} className={`w-full flex justify-between items-center p-4 text-left transition-colors ${isOpen ? 'bg-green-50' : 'bg-gray-50 hover:bg-gray-100'}`}>
            <span className="font-bold text-base text-green-800">{title}</span>
            <div className="flex items-center">
                <div className="flex items-baseline bg-white/60 rounded-lg px-3 py-1 mr-4">
                    <span className="text-2xl font-extrabold text-green-700">{points}</span>
                    <span className="text-lg font-bold text-green-600 opacity-80">/{maxPoints}</span>
                </div>
                <svg className={`w-6 h-6 transition-transform text-gray-600 ${isOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" /></svg>
            </div>
        </button>
        <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-[2000px]' : 'max-h-0'}`}>
            <div className="p-6 bg-white border-t border-gray-200">
                {children}
            </div>
        </div>
    </div>
);

const StyledCheckbox = ({ id, label, checked, onChange }) => (
    <label htmlFor={id} className={`flex items-start p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${checked ? 'bg-green-100 border-green-400' : 'bg-gray-50 border-transparent hover:bg-gray-100'}`}>
        <input type="checkbox" id={id} checked={checked} onChange={onChange} className="h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-green-500 mt-1 flex-shrink-0" />
        <span className={`ml-4 font-semibold ${checked ? 'text-green-800' : 'text-gray-700'}`}>{label}</span>
    </label>
);

const SourceToggle = ({ source, onSourceChange }) => (
    <div className="flex bg-gray-200 rounded-md p-0.5">
        <button onClick={() => onSourceChange('sdplus')} className={`px-3 py-1 text-xs font-semibold rounded ${source === 'sdplus' ? 'bg-white text-green-700 shadow' : 'text-gray-600'}`}>SD+</button>
        <button onClick={() => onSourceChange('custom')} className={`px-3 py-1 text-xs font-semibold rounded ${source === 'custom' ? 'bg-white text-green-700 shadow' : 'text-gray-600'}`}>Custom</button>
    </div>
);

const ProgressIndicator = ({ label, provided, required, onValueChange }) => {
    const progress = required > 0 ? Math.min((provided / required) * 100, 100) : 0;
    const achieved = provided >= required;
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-600 block">{label}</label>
                <input type="number" value={provided} onChange={onValueChange} className="w-full p-2 border border-gray-300 rounded-md text-lg" />
            </div>
            <div className="w-full">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-semibold text-gray-500">Progress</span>
                    <span className={`font-bold text-sm ${achieved ? 'text-green-600' : 'text-gray-600'}`}>{provided} / {required}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
                    <div className={`h-3 rounded-full transition-all duration-300 ${achieved ? 'bg-green-500' : 'bg-orange-500'}`} style={{ width: `${progress}%` }}></div>
                </div>
            </div>
        </div>
    );
};

const LpdPercentageVisualizer = ({ values, baselines }) => {
    const areas = Object.keys(baselines);
    const reductionData = useMemo(() => areas.map(area => {
        const baselineValue = baselines[area];
        const actualValue = parseFloat(values[area]) || 0;
        const reduction = baselineValue > 0 ? ((baselineValue - actualValue) / baselineValue) * 100 : 0;
        return { area, baselineValue, actualValue, reduction };
    }), [values, baselines, areas]);
    return (
        <div>
            <h3 className="font-semibold text-gray-700 mb-2 text-center text-sm">Performance Breakdown</h3>
            <div className="overflow-hidden border border-gray-200 rounded-lg"><table className="min-w-full text-sm text-center"><thead className="bg-gray-100"><tr><th className="p-2 font-semibold text-gray-600">Area</th><th className="p-2 font-semibold text-gray-600">Baseline</th><th className="p-2 font-semibold text-gray-600">Actual</th><th className="p-2 font-semibold text-gray-600">Reduction</th></tr></thead><tbody className="bg-white">{reductionData.map(({ area, baselineValue, actualValue, reduction }) => {let rC='text-gray-700';if(reduction>=30)rC='text-green-600 font-bold';else if(reduction>=25)rC='text-yellow-600 font-semibold';return(<tr key={area} className="border-t border-gray-200"><td className="p-2 font-semibold capitalize">{area}</td><td className="p-2 font-mono text-gray-500">{baselineValue.toFixed(2)}</td><td className="p-2 font-mono text-blue-600">{actualValue.toFixed(2)}</td><td className={`p-2 font-mono ${rC}`}>{reduction.toFixed(1)}%</td></tr>);})}</tbody></table></div>
        </div>
    );
};

const ComplianceIndicator = ({ label, percentage, target, achieved, showProgress = true }) => {
    const progress = target > 0 ? Math.min((percentage / target) * 100, 100) : 0;
    return (
        <div className="mt-2">
            <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-semibold text-gray-600">{label}</span>
                <span className={`font-bold ${achieved ? 'text-green-600' : 'text-orange-500'}`}>{percentage.toFixed(1)}% / {target}%</span>
            </div>
            {showProgress && (
                <div className="w-full bg-gray-200 rounded-full h-2.5 shadow-inner">
                    <div className={`h-2.5 rounded-full transition-all duration-300 ${achieved ? 'bg-green-500' : 'bg-orange-500'}`} style={{ width: `${progress}%` }}></div>
                </div>
            )}
        </div>
    );
};

const DetailedParkingProgress = ({ label, provided, total, thresholds, maxPercent }) => {
    const displayMax = total > 0 ? Math.ceil(total * (maxPercent / 100)) : 1;
    const progressPercent = displayMax > 0 ? Math.min((provided / displayMax) * 100, 100) : 0;

    return (
        <div className="space-y-3 p-4 bg-gray-50 rounded-lg border">
            <h4 className="font-bold text-gray-700 text-sm">{label}</h4>
            <div className="w-full bg-gray-200 rounded-full h-6 relative shadow-inner my-2 text-center">
                <div
                    className="bg-blue-500 h-6 rounded-full transition-all duration-300 flex items-center justify-center text-white text-xs font-bold"
                    style={{ width: `${progressPercent}%` }}
                >
                   {provided} / {total}
                </div>
                 {thresholds.map(t => {
                    const required = Math.ceil(total * (t.percent / 100));
                    const position = (required / displayMax) * 100;
                    if (position > 100) return null;
                    return (
                         <div key={t.percent} className="absolute h-full top-0" style={{left: `${position}%`}}>
                            <div className="w-0.5 h-full bg-gray-400/70"></div>
                            <div className="absolute -top-5 -translate-x-1/2 text-xs font-bold text-gray-600 bg-white/50 px-1 rounded">{t.label}</div>
                            <div className="absolute -bottom-5 -translate-x-1/2 text-xs font-mono text-gray-500 bg-white/50 px-1 rounded">{required}</div>
                         </div>
                    )
                })}
            </div>
        </div>
    );
};


// --- EE-CR-1 Components (Moved to top level) ---

const BuildingEnvelopeCard = ({ retvConfig, uValueConfig, notes, values, onValueChange, onSourceChange }) => {
    const retvPoints = useMemo(() => retvConfig.calculationFn(values.retv), [values.retv, retvConfig]);
    const uValuePoints = useMemo(() => uValueConfig.calculationFn(values.uValue), [values.uValue, uValueConfig]);

    return (
        <CardShell notes={notes}>
            <div className="p-4 border rounded-lg">
                <h3 className="font-bold text-gray-700 mb-4">Credit Inputs</h3>
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                        <div className="w-full space-y-1 bg-slate-50 p-4 rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="font-semibold text-gray-700 text-sm">{retvConfig.inputLabel}</h3>
                                <SourceToggle source={values.retvSource} onSourceChange={(val) => onSourceChange('retvSource', val)} />
                            </div>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={values.retv}
                                    disabled={values.retvSource === 'sdplus'}
                                    onChange={(e) => onValueChange('retv', e.target.value)}
                                    className="w-full text-center text-lg px-2 py-2 bg-white border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                                />
                                {retvConfig.inputUnit && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">{retvConfig.inputUnit}</span>}
                            </div>
                        </div>
                        <CreditVisualizer thresholds={retvConfig.thresholds} calculatedPoints={retvPoints} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                        <div className="w-full space-y-1 bg-slate-50 p-4 rounded-lg">
                             <div className="flex justify-between items-center mb-2">
                                <h3 className="font-semibold text-gray-700 text-sm">{uValueConfig.inputLabel}</h3>
                                <SourceToggle source={values.uValueSource} onSourceChange={(val) => onSourceChange('uValueSource', val)} />
                            </div>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={values.uValue}
                                    disabled={values.uValueSource === 'sdplus'}
                                    onChange={(e) => onValueChange('uValue', e.target.value)}
                                    className="w-full text-center text-lg px-2 py-2 bg-white border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                                />
                                {uValueConfig.inputUnit && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">{uValueConfig.inputUnit}</span>}
                            </div>
                        </div>
                        <CreditVisualizer thresholds={uValueConfig.thresholds} calculatedPoints={uValuePoints} />
                    </div>
                </div>
            </div>
        </CardShell>
    );
};

const LpdCreditCard = ({ baselines, notes, values, onValueChange, onSourceChange, points, thresholds }) => (
    <CardShell notes={notes}>
        <div className="p-4 border rounded-lg">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-700">Credit Inputs</h3>
                <SourceToggle source={values.lpdSource} onSourceChange={(val) => onSourceChange('lpdSource', val)} />
            </div>
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="w-full grid grid-cols-2 gap-3 self-start">
                        {Object.keys(baselines).map(area => (
                            <div key={area} className="space-y-1">
                                <h3 className="font-semibold text-gray-700 text-xs text-center capitalize">{area}</h3>
                                <input name={area} type="text" value={values.lpd[area]} disabled={values.lpdSource === 'sdplus'} onChange={(e) => onValueChange(`lpd.${area}`, e.target.value)} className="w-full text-center text-base px-2 py-2 bg-white border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100" />
                            </div>
                        ))}
                    </div>
                    <div className="space-y-4">
                         <CreditVisualizer thresholds={thresholds} calculatedPoints={points} />
                    </div>
                </div>
                <LpdPercentageVisualizer values={values.lpd} baselines={baselines} />
            </div>
        </div>
    </CardShell>
);

const SelectionCreditCard = ({ options, value, onValueChange, notes }) => (
    <CardShell notes={notes}>
        <div className="p-4 border rounded-lg">
            <h3 className="font-bold text-gray-700 mb-4">Credit Inputs</h3>
            <div className="flex flex-col items-center gap-4 mt-2 flex-grow justify-center">
                <h3 className="font-semibold text-gray-700 text-sm text-center">Select AC Rating</h3>
                <div className="w-full flex flex-col space-y-2">
                    {options.map(option => {
                        const isActive = value === option.value;
                        return (
                            <button key={option.value} onClick={() => onValueChange('ac', option.value)} className={`w-full p-3 rounded-lg transition-all duration-200 border-2 ${isActive ? 'bg-green-100 border-green-400 shadow-md' : 'bg-gray-50 border-transparent hover:bg-gray-100'}`}>
                                <div className="flex justify-between items-center w-full">
                                    <span className={`font-semibold ${isActive ? 'text-green-800' : 'text-gray-700'}`}>{option.label}</span>
                                    <span className={`font-bold text-base px-2 py-0.5 rounded-md ${isActive ? 'bg-green-200 text-green-900' : 'bg-gray-200 text-gray-800'}`}>{option.points} Points</span>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    </CardShell>
);

const MultiSelectionCreditCard = ({ options, values, onValueChange, onSourceChange, notes }) => (
    <CardShell notes={notes}>
        <div className="p-4 border rounded-lg">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-700">Credit Inputs</h3>
                <SourceToggle source={values.lightingControlsSource} onSourceChange={(val) => onSourceChange('lightingControlsSource', val)} />
            </div>
            <div className="flex flex-col items-center gap-3 mt-2 flex-grow justify-center">
                <p className="text-sm text-center text-gray-600 bg-gray-100 p-2 rounded-lg w-full"><strong>Earn 1 point</strong> by selecting at least one control for all non-emergency exterior and common areas.</p>
                <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {options.map(option => {
                        const isSelected = !!values.lightingControls[option.id];
                        return (
                            <label key={option.id} className={`p-2 h-full rounded-lg transition-all duration-200 border-2 flex items-center justify-center text-center cursor-pointer ${isSelected ? 'bg-green-100 border-green-400 shadow-md' : 'bg-gray-50 border-transparent hover:bg-gray-100'}`}>
                                <input type="checkbox" checked={isSelected} disabled={values.lightingControlsSource === 'sdplus'} onChange={() => onValueChange(`lightingControls.${option.id}`, !values.lightingControls[option.id])} className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500" />
                                <span className={`ml-2 font-semibold text-sm ${isSelected ? 'text-green-800' : 'text-gray-700'}`}>{option.label}</span>
                            </label>
                        );
                    })}
                </div>
            </div>
        </div>
    </CardShell>
);

const ConditionalCreditCard = ({ applicability, conditions, values, onValueChange, notes }) => (
    <CardShell notes={notes}>
        <div className="p-4 border rounded-lg">
            <h3 className="font-bold text-gray-700 mb-4">Credit Inputs</h3>
            <div className="flex flex-col items-start gap-4 mt-2 flex-grow justify-center">
                <label className="w-full p-3 rounded-lg bg-yellow-50 border-2 border-yellow-200 flex items-center cursor-pointer">
                    <input type="checkbox" checked={values.isApplicable} onChange={() => onValueChange('spaceHeating.isApplicable', !values.isApplicable)} className="h-5 w-5 rounded border-gray-300 text-yellow-600 focus:ring-yellow-500" />
                    <span className="ml-3 font-semibold text-yellow-800 text-sm">{applicability.label}</span>
                </label>
                <div className={`w-full space-y-2 transition-opacity duration-300 ${values.isApplicable ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                    <p className="text-sm text-center text-gray-600">If applicable, <strong>both</strong> conditions below must be met to earn <strong>1 point</strong>.</p>
                    {conditions.map(cond => (
                        <label key={cond.id} className={`w-full p-3 rounded-lg transition-all duration-200 border-2 flex items-center cursor-pointer ${values.subConditions[cond.id] ? 'bg-green-100 border-green-400' : 'bg-gray-50 border-transparent'}`}>
                            <input type="checkbox" checked={values.subConditions[cond.id]} onChange={() => onValueChange(`spaceHeating.subConditions.${cond.id}`, !values.subConditions[cond.id])} disabled={!values.isApplicable} className="h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-green-500" />
                            <span className="ml-3 text-sm font-semibold text-gray-700">{cond.label}</span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    </CardShell>
);

const PrescriptiveApproach = ({ values, onValueChange, onSourceChange, credits }) => {
    const [openAccordion, setOpenAccordion] = useState('envelope');
    const handleToggle = (accordion) => setOpenAccordion(openAccordion === accordion ? null : accordion);

    const points = useMemo(() => ({
        envelope: credits.buildingEnvelope.retvConfig.calculationFn(values.retv) + credits.buildingEnvelope.uValueConfig.calculationFn(values.uValue),
        lpd: credits.lpd.calculationFn(values.lpd, credits.lpd.baselines),
        ac: credits.ac.calculationFn(values.ac),
        lighting: credits.lightingControls.calculationFn(values.lightingControls),
        heating: credits.spaceHeating.calculationFn(values.spaceHeating.isApplicable, values.spaceHeating.subConditions)
    }), [values, credits]);

    return (
        <div className="space-y-4">
            <Accordion title="1. Building Envelope" points={points.envelope} maxPoints={7} isOpen={openAccordion === 'envelope'} onToggle={() => handleToggle('envelope')}>
                <BuildingEnvelopeCard values={values} onValueChange={(key, val) => onValueChange('ee', 'eeCr1', key, val)} onSourceChange={(key, val) => onSourceChange('ee', 'eeCr1', key, val)} {...credits.buildingEnvelope} />
            </Accordion>
            <Accordion title="2. Lighting Power Density (LPD)" points={points.lpd} maxPoints={2} isOpen={openAccordion === 'lpd'} onToggle={() => handleToggle('lpd')}>
                <LpdCreditCard values={values} onValueChange={(key, val) => onValueChange('ee', 'eeCr1', key, val)} onSourceChange={(key, val) => onSourceChange('ee', 'eeCr1', key, val)} {...credits.lpd} points={points.lpd} />
            </Accordion>
            <Accordion title="3. Air Conditioning Systems" points={points.ac} maxPoints={2} isOpen={openAccordion === 'ac'} onToggle={() => handleToggle('ac')}>
                 <SelectionCreditCard value={values.ac} onValueChange={(key, val) => onValueChange('ee', 'eeCr1', key, val)} {...credits.ac} options={credits.ac.options.map(o => ({...o, points: credits.ac.calculationFn(o.value)}))} />
            </Accordion>
            <Accordion title="4. Lighting Controls" points={points.lighting} maxPoints={1} isOpen={openAccordion === 'lighting'} onToggle={() => handleToggle('lighting')}>
                <MultiSelectionCreditCard values={values} onValueChange={(key, val) => onValueChange('ee', 'eeCr1', key, val)} onSourceChange={(key, val) => onSourceChange('ee', 'eeCr1', key, val)} {...credits.lightingControls} />
            </Accordion>
            <Accordion title="5. Space Heating Systems" points={points.heating} maxPoints={1} isOpen={openAccordion === 'heating'} onToggle={() => handleToggle('heating')}>
                 <ConditionalCreditCard values={values.spaceHeating} onValueChange={(key, val) => onValueChange('ee', 'eeCr1', key, val)} {...credits.spaceHeating} />
            </Accordion>
        </div>
    );
};

const SimulationApproach = ({ values, onValueChange, points, notes }) => {
    const thresholds = [ { points: 1, label: '2.5%' }, { points: 2, label: '5%' }, { points: 3, label: '7.5%' }, { points: 4, label: '10%' }, { points: 5, label: '12.5%' }, { points: 6, label: '15%' }, { points: 7, label: '17.5%' }, { points: 8, label: '20%' }, { points: 9, label: '22.5%' }, { points: 10, label: '25%' } ];
    return (
        <CardShell notes={notes}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                <div className="w-full space-y-1 bg-slate-50 p-4 rounded-lg md:col-span-1">
                    <h3 className="font-semibold text-gray-700 text-sm text-center">Energy Savings Percentage (Simulation Result)</h3>
                    <div className="relative">
                        <input
                            type="text"
                            value={values.simulation.energySavings}
                            onChange={(e) => onValueChange('ee', 'eeCr1', 'simulation.energySavings', e.target.value)}
                            className="w-full text-center text-lg px-2 py-2 bg-white border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
                    </div>
                </div>
                <div className="md:col-span-2">
                    <CreditVisualizer thresholds={thresholds} calculatedPoints={points} pointsLabel="% Improvement" />
                </div>
            </div>
        </CardShell>
    );
};

// --- SD-CR-3 Component (Moved to top level) ---
const MeasureAccordion = ({ title, isSelected, onToggle, pointsAchieved, children, isOpen, onHeaderClick }) => (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className={`flex items-center p-4 transition-colors cursor-pointer ${isOpen ? 'bg-green-50' : 'bg-gray-50 hover:bg-gray-100'}`} onClick={onHeaderClick}>
            <input type="checkbox" checked={isSelected} onChange={onToggle} className="h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-green-500" onClick={(e) => e.stopPropagation()} />
            <span className="ml-4 font-bold text-base text-green-800 flex-grow">{title}</span>
            {isSelected && (
                 <div className={`flex items-baseline bg-white rounded-lg px-3 py-1 mr-4 border border-gray-200/80 shadow-sm`}>
                    <span className={`text-2xl font-extrabold text-green-700`}>{pointsAchieved}</span>
                    <span className={`text-lg font-bold text-green-600 opacity-80`}>/1</span>
                </div>
            )}
            <svg className={`w-6 h-6 transition-transform text-gray-600 ${isOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" /></svg>
        </div>
        <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen && isSelected ? 'max-h-[1000px]' : 'max-h-0'}`}>
            <div className="p-6 bg-white border-t border-gray-200">
                {children}
            </div>
        </div>
    </div>
);


// --- Sustainable Design (SD) Components ---
const NaturalTopographyPage = ({ onBack, values, onValueChange, credit }) => {
    const { complianceOption, siteArea, naturalTopographyArea, vegetationOnGround, vegetationOnBuilt } = values;
    
    const totalVegetatedArea = useMemo(() => {
        const natural = parseFloat(naturalTopographyArea) || 0;
        const ground = parseFloat(vegetationOnGround) || 0;
        const built = parseFloat(vegetationOnBuilt) || 0;
        if (complianceOption === 'A') {
            return natural + ground;
        }
        return natural + ground + built;
    }, [complianceOption, naturalTopographyArea, vegetationOnGround, vegetationOnBuilt]);

    const percentage = useMemo(() => {
        const site = parseFloat(siteArea) || 0;
        if (site === 0) return 0;
        return (totalVegetatedArea / site) * 100;
    }, [totalVegetatedArea, siteArea]);

    const calculatedPoints = useMemo(() => credit.calculationFn(complianceOption, percentage), [complianceOption, percentage, credit]);
    
    const dynamicThresholds = useMemo(() => {
        const site = parseFloat(siteArea) || 0;
        const thresholds = complianceOption === 'A' ? credit.thresholdsA : credit.thresholdsB;
        return thresholds.map(t => {
            const percentageValue = parseFloat(t.label);
            const requiredArea = (site * percentageValue) / 100;
            return { ...t, label: `${t.label} (${requiredArea.toFixed(0)} sqm)` }
        })
    }, [siteArea, complianceOption, credit]);

    const nextPointData = useMemo(() => {
        const thresholds = complianceOption === 'A' ? credit.thresholdsA : credit.thresholdsB;
        const maxPoints = complianceOption === 'A' ? 2 : 4;
        const nextThreshold = thresholds.find(t => t.points > calculatedPoints);
        
        if (!nextThreshold || calculatedPoints >= maxPoints) return { shortfall: 0, isComplete: true };
        
        const site = parseFloat(siteArea) || 0;
        const targetPercentage = parseFloat(nextThreshold.label);
        const targetArea = (site * targetPercentage) / 100;
        const shortfall = targetArea - totalVegetatedArea;
        return { shortfall, isComplete: false };
    }, [calculatedPoints, complianceOption, siteArea, totalVegetatedArea, credit]);

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
            <div className="flex items-center justify-between">
                <button onClick={onBack} className="flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors">
                    <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.79 5.23a.75.75 0 0 1 0 1.06L9.06 10l3.73 3.71a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" /></svg>
                    Back to Credits
                </button>
            </div>
            <div className="bg-green-600 text-white rounded-xl p-6 flex flex-col md:flex-row justify-between items-center shadow-lg">
                <h2 className="text-xl font-bold mb-2 md:mb-0">SD-CR-1: Natural Topography or Vegetation</h2>
                <div className="text-center">
                     <span className="text-sm font-semibold opacity-80 block">Total Points</span>
                     <div className="flex items-baseline">
                        <span className="text-6xl font-bold">{calculatedPoints}</span>
                        <span className="text-3xl font-semibold opacity-80">/4</span>
                    </div>
                </div>
            </div>
            <CardShell notes={credit.notes}>
                 <div className="space-y-6">
                    <div className="p-4 border rounded-lg">
                        <h3 className="font-bold text-gray-700 mb-4">Credit Inputs</h3>
                        <div className="flex justify-center bg-gray-200 rounded-lg p-1 mb-6">
                            <button onClick={() => onValueChange('sd', 'sdCr1', 'complianceOption', 'A')} className={`w-1/2 p-2 rounded-md font-semibold transition-colors ${complianceOption === 'A' ? 'bg-white text-green-700 shadow' : 'text-gray-600'}`}>Case A: Vegetation on Ground</button>
                            <button onClick={() => onValueChange('sd', 'sdCr1', 'complianceOption', 'B')} className={`w-1/2 p-2 rounded-md font-semibold transition-colors ${complianceOption === 'B' ? 'bg-white text-green-700 shadow' : 'text-gray-600'}`}>Case B: Vegetation on Ground & Built Structures</button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-600 block mb-1">Natural Topography Area (sqm)</label>
                                    <input type="text" value={naturalTopographyArea} onChange={(e) => onValueChange('sd', 'sdCr1', 'naturalTopographyArea', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
                                </div>
                                 <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-600 block mb-1">Vegetation Area on Ground (sqm)</label>
                                    <input type="text" value={vegetationOnGround} onChange={(e) => onValueChange('sd', 'sdCr1', 'vegetationOnGround', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
                                </div>
                                {complianceOption === 'B' && (
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-600 block mb-1">Vegetation Area on Built Structures (sqm)</label>
                                        <input type="text" value={vegetationOnBuilt} onChange={(e) => onValueChange('sd', 'sdCr1', 'vegetationOnBuilt', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                )}
                                <NextPointInsight shortfall={nextPointData.shortfall} isComplete={nextPointData.isComplete} unit="sqm" message="Provide" />
                            </div>
                            <div className="space-y-4">
                                <CreditVisualizer thresholds={dynamicThresholds} calculatedPoints={calculatedPoints} pointsLabel="Percentage of Area (Target Area)" />
                                 <div className="p-3 bg-blue-50 rounded-lg text-center">
                                    <p className="text-sm text-blue-800">Total Vegetated Area</p>
                                    <p className="text-2xl font-bold text-blue-900">{totalVegetatedArea.toFixed(2)} sqm</p>
                                    <p className="text-sm text-blue-800 mt-2">Percentage of Vegetated Area</p>
                                    <p className="text-3xl font-bold text-blue-900">{percentage.toFixed(2)}%</p>
                                </div>
                            </div>
                        </div>
                    </div>
                     <div className="p-4 border rounded-lg bg-gray-50">
                         <h3 className="font-bold text-gray-700 mb-3">Project Details</h3>
                         <div>
                            <label className="text-sm font-semibold text-gray-600 block mb-1">Site Area (sqm)</label>
                            <input type="text" value={siteArea} onChange={e => onValueChange('sd', 'sdCr1', 'siteArea', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
                        </div>
                    </div>
                </div>
            </CardShell>
        </div>
    );
};
const HeatIslandEffectPage = ({ onBack, values, onValueChange, credit }) => {
    const [openAccordion, setOpenAccordion] = useState('non-roof');

    const handleToggle = (accordion) => {
        setOpenAccordion(openAccordion === accordion ? null : accordion);
    };

    const { nonRoof, roof } = values;

    const nonRoofCompliantArea = useMemo(() => {
        return (parseFloat(nonRoof.treeCover) || 0) + (parseFloat(nonRoof.openGrid) || 0) + (parseFloat(nonRoof.hardscape) || 0);
    }, [nonRoof]);

    const nonRoofPercentage = useMemo(() => {
        const total = parseFloat(nonRoof.totalArea) || 0;
        return total > 0 ? (nonRoofCompliantArea / total) * 100 : 0;
    }, [nonRoofCompliantArea, nonRoof.totalArea]);

    const nonRoofPoints = useMemo(() => credit.nonRoof.calculationFn(nonRoofPercentage), [nonRoofPercentage, credit.nonRoof]);

    const nonRoofThresholds = useMemo(() => {
        const total = parseFloat(nonRoof.totalArea) || 0;
        return credit.nonRoof.thresholds.map(t => {
            const percentageValue = parseFloat(t.label);
            const requiredArea = (total * percentageValue) / 100;
            return { ...t, label: `${t.label} (${requiredArea.toFixed(0)} sqm)` };
        });
    }, [nonRoof.totalArea, credit.nonRoof.thresholds]);
    
    const nextPointDataNonRoof = useMemo(() => {
        const nextThreshold = credit.nonRoof.thresholds.find(t => t.points > nonRoofPoints);
        if (!nextThreshold) return { shortfall: 0, isComplete: true };
        
        const total = parseFloat(nonRoof.totalArea) || 0;
        const targetPercentage = parseFloat(nextThreshold.label);
        const targetArea = (total * targetPercentage) / 100;
        const shortfall = targetArea - nonRoofCompliantArea;
        return { shortfall, isComplete: false };
    }, [nonRoofPoints, nonRoof.totalArea, nonRoofCompliantArea, credit.nonRoof]);

    const roofCompliantArea = useMemo(() => {
        return (parseFloat(roof.highSRI) || 0) + (parseFloat(roof.vegetation) || 0);
    }, [roof]);

    const roofPercentage = useMemo(() => {
        const total = parseFloat(roof.totalArea) || 0;
        return total > 0 ? (roofCompliantArea / total) * 100 : 0;
    }, [roofCompliantArea, roof.totalArea]);

    const roofPoints = useMemo(() => credit.roof.calculationFn(roofPercentage), [roofPercentage, credit.roof]);

    const roofThresholds = useMemo(() => {
        const total = parseFloat(roof.totalArea) || 0;
        return credit.roof.thresholds.map(t => {
            const percentageValue = parseFloat(t.label);
            const requiredArea = (total * percentageValue) / 100;
            return { ...t, label: `${t.label} (${requiredArea.toFixed(0)} sqm)` };
        });
    }, [roof.totalArea, credit.roof.thresholds]);

    const nextPointDataRoof = useMemo(() => {
        const nextThreshold = credit.roof.thresholds.find(t => t.points > roofPoints);
        if (!nextThreshold) return { shortfall: 0, isComplete: true };
        
        const total = parseFloat(roof.totalArea) || 0;
        const targetPercentage = parseFloat(nextThreshold.label);
        const targetArea = (total * targetPercentage) / 100;
        const shortfall = targetArea - roofCompliantArea;
        return { shortfall, isComplete: false };
    }, [roofPoints, roof.totalArea, roofCompliantArea, credit.roof]);

    const totalPoints = nonRoofPoints + roofPoints;

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
            <div className="flex items-center justify-between">
                <button onClick={onBack} className="flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors">
                    <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.79 5.23a.75.75 0 0 1 0 1.06L9.06 10l3.73 3.71a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" /></svg>
                    Back to Credits
                </button>
            </div>
            <div className="bg-green-600 text-white rounded-xl p-6 flex flex-col md:flex-row justify-between items-center shadow-lg">
                <h2 className="text-xl font-bold mb-2 md:mb-0">SD-CR-2: Heat Island Effect, Non-roof & Roof</h2>
                <div className="text-center">
                     <span className="text-sm font-semibold opacity-80 block">Total Points</span>
                     <div className="flex items-baseline">
                        <span className="text-6xl font-bold">{totalPoints}</span>
                        <span className="text-3xl font-semibold opacity-80">/4</span>
                    </div>
                </div>
            </div>
            <div className="space-y-4">
                <Accordion title="1. Heat Island Effect - Non-Roof areas" points={nonRoofPoints} maxPoints={2} isOpen={openAccordion === 'non-roof'} onToggle={() => handleToggle('non-roof')}>
                    <CardShell notes={credit.nonRoof.notes}>
                        <div className="space-y-6">
                             <div className="p-4 border rounded-lg">
                                <h3 className="font-bold text-gray-700 mb-4">Credit Inputs</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-600 block mb-1">Shade from Tree Cover (sqm)</label>
                                            <input type="text" value={nonRoof.treeCover} onChange={(e) => onValueChange('sd', 'sdCr2', 'nonRoof.treeCover', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-600 block mb-1">Open Grid Pavers or Grass Pavers (sqm)</label>
                                            <input type="text" value={nonRoof.openGrid} onChange={(e) => onValueChange('sd', 'sdCr2', 'nonRoof.openGrid', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-600 block mb-1">Hardscape with SRI {'>='} 29 (sqm)</label>
                                            <input type="text" value={nonRoof.hardscape} onChange={(e) => onValueChange('sd', 'sdCr2', 'nonRoof.hardscape', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
                                        </div>
                                        <NextPointInsight shortfall={nextPointDataNonRoof.shortfall} isComplete={nextPointDataNonRoof.isComplete} unit="sqm of compliant area" message="Provide" />
                                    </div>
                                    <div className="space-y-4">
                                        <CreditVisualizer thresholds={nonRoofThresholds} calculatedPoints={nonRoofPoints} pointsLabel="Percentage of Area (Target Area)" />
                                        <div className="p-3 bg-blue-50 rounded-lg text-center">
                                            <p className="text-sm text-blue-800">Total Compliant Area</p>
                                            <p className="text-2xl font-bold text-blue-900">{nonRoofCompliantArea.toFixed(2)} sqm</p>
                                            <p className="text-sm text-blue-800 mt-2">Percentage of Compliant Area</p>
                                            <p className="text-3xl font-bold text-blue-900">{nonRoofPercentage.toFixed(2)}%</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                             <div className="p-4 border rounded-lg bg-gray-50">
                                <h3 className="font-bold text-gray-700 mb-3">Project Details</h3>
                                <div>
                                    <label className="text-sm font-semibold text-gray-600 block mb-1">Total Non-Roof Impervious Area (sqm)</label>
                                    <input type="text" value={nonRoof.totalArea} onChange={e => onValueChange('sd', 'sdCr2', 'nonRoof.totalArea', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
                                </div>
                            </div>
                        </div>
                    </CardShell>
                </Accordion>
                <Accordion title="2. Heat Island Effect - Roof Areas" points={roofPoints} maxPoints={2} isOpen={openAccordion === 'roof'} onToggle={() => handleToggle('roof')}>
                     <CardShell notes={credit.roof.notes}>
                        <div className="space-y-6">
                            <div className="p-4 border rounded-lg">
                                <h3 className="font-bold text-gray-700 mb-4">Credit Inputs</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-600 block mb-1">High SRI Materials / High Albedo / White Tiles (sqm)</label>
                                            <input type="text" value={roof.highSRI} onChange={(e) => onValueChange('sd', 'sdCr2', 'roof.highSRI', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-600 block mb-1">Roof Garden / Vegetation (sqm)</label>
                                            <input type="text" value={roof.vegetation} onChange={(e) => onValueChange('sd', 'sdCr2', 'roof.vegetation', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
                                        </div>
                                        <NextPointInsight shortfall={nextPointDataRoof.shortfall} isComplete={nextPointDataRoof.isComplete} unit="sqm of compliant area" message="Provide" />
                                    </div>
                                    <div className="space-y-4">
                                        <CreditVisualizer thresholds={roofThresholds} calculatedPoints={roofPoints} pointsLabel="Percentage of Area (Target Area)" />
                                        <div className="p-3 bg-blue-50 rounded-lg text-center">
                                            <p className="text-sm text-blue-800">Total Compliant Area</p>
                                            <p className="text-2xl font-bold text-blue-900">{roofCompliantArea.toFixed(2)} sqm</p>
                                            <p className="text-sm text-blue-800 mt-2">Percentage of Compliant Area</p>
                                            <p className="text-3xl font-bold text-blue-900">{roofPercentage.toFixed(2)}%</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                             <div className="p-4 border rounded-lg bg-gray-50">
                                <h3 className="font-bold text-gray-700 mb-3">Project Details</h3>
                                <div>
                                    <label className="text-sm font-semibold text-gray-600 block mb-1">Total Exposed Roof Area (sqm)</label>
                                    <input type="text" value={roof.totalArea} onChange={e => onValueChange('sd', 'sdCr2', 'roof.totalArea', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
                                </div>
                            </div>
                        </div>
                    </CardShell>
                </Accordion>
            </div>
        </div>
    );
};
const PassiveArchitecturePage = ({ onBack, values, onValueChange, credit }) => {
    const [openMeasure, setOpenMeasure] = useState('exteriorOpenings');
    const calculatedPoints = useMemo(() => credit.calculationFn(values), [values, credit]);

    const handleMeasureToggle = (measure) => {
        onValueChange('sd', 'sdCr3', `selectedMeasures.${measure}`, !values.selectedMeasures[measure]);
    };

    const exteriorOpeningsPercentage = useMemo(() => {
        const total = parseFloat(values.exteriorOpenings.totalWindows) || 0;
        const compliant = parseFloat(values.exteriorOpenings.compliantWindows) || 0;
        return total > 0 ? (compliant / total) * 100 : 0;
    }, [values.exteriorOpenings]);
    const isExteriorOpeningsAchieved = exteriorOpeningsPercentage >= 80;
    const exteriorOpeningsShortfall = useMemo(() => {
        const total = parseFloat(values.exteriorOpenings.totalWindows) || 0;
        const compliant = parseFloat(values.exteriorOpenings.compliantWindows) || 0;
        return (total * 0.8) - compliant;
    }, [values.exteriorOpenings]);

    const skylightsPercentage = useMemo(() => {
        const total = parseFloat(values.skylights.roofArea) || 0;
        const compliant = parseFloat(values.skylights.skylightArea) || 0;
        return total > 0 ? (compliant / total) * 100 : 0;
    }, [values.skylights]);
    const isSkylightsAchieved = skylightsPercentage >= 10;
     const skylightsShortfall = useMemo(() => {
        const total = parseFloat(values.skylights.roofArea) || 0;
        const compliant = parseFloat(values.skylights.skylightArea) || 0;
        return (total * 0.1) - compliant;
    }, [values.skylights]);
    
    const daylightingPercentage = useMemo(() => parseFloat(values.daylighting.percentage) || 0, [values.daylighting]);
    const isDaylightingAchieved = daylightingPercentage >= 50;
    const daylightingShortfall = 50 - daylightingPercentage;

    const isPassiveCoolingAchieved = useMemo(() => Object.values(values.passiveCooling).some(v => v), [values.passiveCooling]);
    
    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
            <div className="flex items-center justify-between">
                <button onClick={onBack} className="flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors">
                    <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.79 5.23a.75.75 0 0 1 0 1.06L9.06 10l3.73 3.71a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" /></svg>
                    Back to Credits
                </button>
            </div>
            <div className="bg-green-600 text-white rounded-xl p-6 flex flex-col md:flex-row justify-between items-center shadow-lg">
                <h2 className="text-xl font-bold mb-2 md:mb-0">SD-CR-3: Passive Architecture</h2>
                <div className="text-center">
                    <span className="text-sm font-semibold opacity-80 block">Total Points</span>
                    <div className="flex items-baseline">
                        <span className="text-6xl font-bold">{calculatedPoints}</span>
                        <span className="text-3xl font-semibold opacity-80">/2</span>
                    </div>
                </div>
            </div>
            <CardShell notes={credit.notes}>
                 <p className="text-sm text-center text-gray-600 bg-gray-100 p-3 rounded-lg mb-6">Select and implement any of the following passive measures. (1 point for each measure achieved; max. 2 points)</p>
                <div className="space-y-4">
                    <MeasureAccordion 
                        title="1. Exterior Openings (Projection Factor)"
                        isSelected={values.selectedMeasures.exteriorOpenings}
                        onToggle={() => handleMeasureToggle('exteriorOpenings')}
                        pointsAchieved={isExteriorOpeningsAchieved ? 1 : 0}
                        isOpen={openMeasure === 'exteriorOpenings'}
                        onHeaderClick={() => setOpenMeasure(openMeasure === 'exteriorOpenings' ? null : 'exteriorOpenings')}
                    >
                        <p className="text-xs text-gray-500 mb-4">At least 80% of openings have PF of 0.5 or more.</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-semibold text-gray-600 block mb-1">Compliant Windows (PF {'>='} 0.5)</label>
                                <input type="number" value={values.exteriorOpenings.compliantWindows} onChange={e => onValueChange('sd', 'sdCr3', 'exteriorOpenings.compliantWindows', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" placeholder="Count" />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-gray-600 block mb-1">Total Windows</label>
                                <input type="number" value={values.exteriorOpenings.totalWindows} onChange={e => onValueChange('sd', 'sdCr3', 'exteriorOpenings.totalWindows', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" placeholder="Count" />
                            </div>
                        </div>
                        <ComplianceIndicator label="Compliance Progress" percentage={exteriorOpeningsPercentage} target={80} achieved={isExteriorOpeningsAchieved} />
                        {!isExteriorOpeningsAchieved && <NextPointInsight shortfall={exteriorOpeningsShortfall} unit="compliant windows" message="Provide" isComplete={false} />}
                    </MeasureAccordion>

                    <MeasureAccordion 
                        title="2. Skylights or Courtyards"
                        isSelected={values.selectedMeasures.skylights}
                        onToggle={() => handleMeasureToggle('skylights')}
                        pointsAchieved={isSkylightsAchieved ? 1 : 0}
                        isOpen={openMeasure === 'skylights'}
                        onHeaderClick={() => setOpenMeasure(openMeasure === 'skylights' ? null : 'skylights')}
                    >
                        <p className="text-xs text-gray-500 mb-4">Skylight area is at least 10% of the roof area.</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-semibold text-gray-600 block mb-1">Skylight Area (sqm)</label>
                                <input type="number" value={values.skylights.skylightArea} onChange={e => onValueChange('sd', 'sdCr3', 'skylights.skylightArea', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" placeholder="sqm" />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-gray-600 block mb-1">Total Building Roof Area (sqm)</label>
                                <input type="number" value={values.skylights.roofArea} onChange={e => onValueChange('sd', 'sdCr3', 'skylights.roofArea', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" placeholder="sqm" />
                            </div>
                        </div>
                        <ComplianceIndicator label="Compliance Progress" percentage={skylightsPercentage} target={10} achieved={isSkylightsAchieved} />
                        {!isSkylightsAchieved && <NextPointInsight shortfall={skylightsShortfall} unit="sqm of skylight area" message="Provide" isComplete={false} />}
                    </MeasureAccordion>

                     <MeasureAccordion 
                        title="3. Daylighting in Common Areas"
                        isSelected={values.selectedMeasures.daylighting}
                        onToggle={() => handleMeasureToggle('daylighting')}
                        pointsAchieved={isDaylightingAchieved ? 1 : 0}
                        isOpen={openMeasure === 'daylighting'}
                        onHeaderClick={() => setOpenMeasure(openMeasure === 'daylighting' ? null : 'daylighting')}
                    >
                        <p className="text-xs text-gray-500 mb-4">At least 50% of common areas have daylight.</p>
                        <div>
                            <label className="text-sm font-semibold text-gray-600 block mb-1">Compliant Common Area (%)</label>
                            <input type="number" value={values.daylighting.percentage} onChange={e => onValueChange('sd', 'sdCr3', 'daylighting.percentage', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" placeholder="%" />
                        </div>
                        <ComplianceIndicator label="Compliance Progress" percentage={daylightingPercentage} target={50} achieved={isDaylightingAchieved} />
                        {!isDaylightingAchieved && <NextPointInsight shortfall={daylightingShortfall} unit="% of compliant area" message="Increase" isComplete={false} />}
                    </MeasureAccordion>

                    <MeasureAccordion 
                        title="4. Passive Cooling / Heating"
                        isSelected={values.selectedMeasures.passiveCooling}
                        onToggle={() => handleMeasureToggle('passiveCooling')}
                        pointsAchieved={isPassiveCoolingAchieved ? 1 : 0}
                        isOpen={openMeasure === 'passiveCooling'}
                        onHeaderClick={() => setOpenMeasure(openMeasure === 'passiveCooling' ? null : 'passiveCooling')}
                    >
                        <p className="text-xs text-gray-500 mb-4">Implement at least one measure.</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                            {Object.keys(values.passiveCooling).map(key => (
                                <div key={key} className="flex items-center">
                                    <input id={`passive-${key}`} type="checkbox" checked={values.passiveCooling[key]} onChange={() => onValueChange('sd', 'sdCr3', `passiveCooling.${key}`, !values.passiveCooling[key])} className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500" />
                                    <label htmlFor={`passive-${key}`} className="ml-3 text-sm text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
                                </div>
                            ))}
                        </div>
                         {!isPassiveCoolingAchieved && <NextPointInsight isComplete={false} customMessage="Select at least one passive cooling measure." />}
                    </MeasureAccordion>
                </div>
            </CardShell>
        </div>
    );
};
const UniversalDesignPage = ({ onBack, values, onValueChange, credit }) => {
    const [openAccordion, setOpenAccordion] = useState('partA');
    const { dwellingUnits, partA, partB } = values;

    const requiredParking = useMemo(() => Math.ceil(parseInt(dwellingUnits) / 250) || 0, [dwellingUnits]);
    const requiredRestRooms = useMemo(() => Math.ceil(parseInt(dwellingUnits) / 250) || 0, [dwellingUnits]);

    const partAPoints = useMemo(() => {
        const providedParking = parseInt(partA.providedParking) || 0;
        const providedRestRooms = parseInt(partA.providedRestRooms) || 0;
        return (providedParking >= requiredParking && providedRestRooms >= requiredRestRooms && partA.wheelchairProvision) ? 1 : 0;
    }, [partA, requiredParking, requiredRestRooms]);

    const partBSelectedCount = useMemo(() => Object.values(partB).filter(Boolean).length, [partB]);
    const partBPoints = useMemo(() => partBSelectedCount >= 4 ? 1 : 0, [partBSelectedCount]);
    const totalPoints = partAPoints + partBPoints;

    const handlePartAChange = (key, value) => {
        onValueChange('sd', 'sdCr4', `partA.${key}`, value);
    };
    
    const handlePartBChange = (key) => {
        onValueChange('sd', 'sdCr4', `partB.${key}`, !partB[key]);
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
            <div className="flex items-center justify-between">
                <button onClick={onBack} className="flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors">
                    <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.79 5.23a.75.75 0 0 1 0 1.06L9.06 10l3.73 3.71a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" /></svg>
                    Back to Credits
                </button>
            </div>
            <div className="bg-green-600 text-white rounded-xl p-6 flex flex-col md:flex-row justify-between items-center shadow-lg">
                <h2 className="text-xl font-bold mb-2 md:mb-0">SD-CR-4: Universal Design</h2>
                <div className="text-center">
                     <span className="text-sm font-semibold opacity-80 block">Total Points</span>
                     <div className="flex items-baseline">
                        <span className="text-6xl font-bold">{totalPoints}</span>
                        <span className="text-3xl font-semibold opacity-80">/2</span>
                    </div>
                </div>
            </div>
            <CardShell notes={credit.notes}>
                <div className="space-y-4">
                    <Accordion title="Part A: Project Provisions (1 Point)" points={partAPoints} maxPoints={1} isOpen={openAccordion === 'partA'} onToggle={() => setOpenAccordion(openAccordion === 'partA' ? null : 'partA')}>
                        <div className="p-3 bg-blue-50 border-l-4 border-blue-400 mb-6">
                           <p className="text-sm text-blue-800 font-semibold">All three measures under Part A need to be implemented to get the point.</p>
                        </div>
                        <div className="space-y-6">
                            <ProgressIndicator label="Preferred Car Park Spaces Provided" provided={parseInt(partA.providedParking) || 0} required={requiredParking} onValueChange={(e) => handlePartAChange('providedParking', e.target.value)} />
                            <ProgressIndicator label="Accessible Rest Rooms Provided" provided={parseInt(partA.providedRestRooms) || 0} required={requiredRestRooms} onValueChange={(e) => handlePartAChange('providedRestRooms', e.target.value)} />
                            <StyledCheckbox id="wheelchair" label="Wheelchair and stretcher board provision near security area." checked={partA.wheelchairProvision} onChange={() => handlePartAChange('wheelchairProvision', !partA.wheelchairProvision)} />
                            <div className="p-4 border rounded-lg bg-gray-50 mt-4">
                                <h3 className="font-bold text-gray-700 mb-3">Project Details</h3>
                                <div>
                                    <label className="text-sm font-semibold text-gray-600 block mb-1">Number of Dwelling Units</label>
                                    <input type="number" value={dwellingUnits} onChange={e => onValueChange('sd', 'sdCr4', 'dwellingUnits', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" />
                                </div>
                            </div>
                        </div>
                    </Accordion>
                    <Accordion title="Part B: Any Four Measures (1 Point)" points={partBPoints} maxPoints={1} isOpen={openAccordion === 'partB'} onToggle={() => setOpenAccordion(openAccordion === 'partB' ? null : 'partB')}>
                        <div className="p-3 bg-blue-50 border-l-4 border-blue-400 mb-6">
                           <p className="text-sm text-blue-800 font-semibold">Any 4 measures implemented will earn the point.</p>
                        </div>
                         <div className="space-y-3">
                            {credit.options.partB.map(option => (
                                <StyledCheckbox key={option.id} id={option.id} label={option.label} checked={partB[option.id]} onChange={() => handlePartBChange(option.id)} />
                            ))}
                        </div>
                        <div className="mt-6 p-3 bg-blue-50 rounded-lg text-center">
                            <p className="text-sm text-blue-800">Measures Selected</p>
                            <p className="text-3xl font-bold text-blue-900">{partBSelectedCount} / 4</p>
                        </div>
                    </Accordion>
                </div>
            </CardShell>
        </div>
    );
};
const GreenParkingFacilityPage = ({ onBack, values, onValueChange, credit, allValues }) => {
    const [openAccordion, setOpenAccordion] = useState('ventilation');
    const { ventilation, evCharging, bicycleParking } = values;

    const handleAccordionToggle = (accordion) => {
        setOpenAccordion(openAccordion === accordion ? null : accordion);
    };

    // Part 1: Ventilation Calculations
    const ventilationPoints = useMemo(() => credit.ventilation.calculationFn(ventilation), [ventilation, credit.ventilation]);

    // Part 2: EV Charging Calculations
    const evPercentage4W = useMemo(() => {
        const total = parseFloat(evCharging.total4W) || 0;
        return total > 0 ? ((parseFloat(evCharging.catered4W) || 0) / total) * 100 : 0;
    }, [evCharging]);
    const evPercentage2W = useMemo(() => {
        const total = parseFloat(evCharging.total2W) || 0;
        return total > 0 ? ((parseFloat(evCharging.catered2W) || 0) / total) * 100 : 0;
    }, [evCharging]);
    const finalEVPercentage = useMemo(() => Math.min(evPercentage4W, evPercentage2W), [evPercentage4W, evPercentage2W]);
    const evPoints = useMemo(() => credit.evCharging.calculationFn(finalEVPercentage), [finalEVPercentage, credit.evCharging]);
    
    const nextPointDataEV = (catered, total, points) => {
        const nextThreshold = credit.evCharging.thresholds.find(t => t.points > points);
        if(!nextThreshold) return { isComplete: true, shortfall: 0 };
        
        const targetPercent = parseFloat(nextThreshold.label);
        const required = Math.ceil(parseFloat(total) * (targetPercent / 100));
        const shortfall = required - (parseFloat(catered) || 0);

        return { isComplete: false, shortfall };
    };
    
    const insight4W = nextPointDataEV(evCharging.catered4W, evCharging.total4W, credit.evCharging.calculationFn(evPercentage4W));
    const insight2W = nextPointDataEV(evCharging.catered2W, evCharging.total2W, credit.evCharging.calculationFn(evPercentage2W));


    // Part 3: Bicycle Parking Calculations
    const dwellingUnits = useMemo(() => parseFloat(allValues.sd.sdCr4.dwellingUnits) || 0, [allValues.sd.sdCr4.dwellingUnits]);
    const bicyclePercentage = useMemo(() => {
        return dwellingUnits > 0 ? ((parseFloat(bicycleParking.spaces) || 0) / dwellingUnits) * 100 : 0;
    }, [bicycleParking.spaces, dwellingUnits]);
    const bicyclePoints = useMemo(() => credit.bicycleParking.calculationFn(bicyclePercentage, bicycleParking.signage), [bicyclePercentage, bicycleParking.signage, credit.bicycleParking]);
    
    const bicycleShortfall = useMemo(() => {
        const requiredSpaces = Math.ceil(dwellingUnits * 0.05);
        const providedSpaces = parseFloat(bicycleParking.spaces) || 0;
        return requiredSpaces - providedSpaces;
    }, [dwellingUnits, bicycleParking.spaces]);

    const totalPoints = ventilationPoints + evPoints + bicyclePoints;

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
            <div className="flex items-center justify-between">
                <button onClick={onBack} className="flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors">
                    <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.79 5.23a.75.75 0 0 1 0 1.06L9.06 10l3.73 3.71a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" /></svg>
                    Back to Credits
                </button>
            </div>
            <div className="bg-green-600 text-white rounded-xl p-6 flex flex-col md:flex-row justify-between items-center shadow-lg">
                <h2 className="text-xl font-bold mb-2 md:mb-0">SD-CR-5: Green Parking Facility</h2>
                <div className="text-center">
                     <span className="text-sm font-semibold opacity-80 block">Total Points</span>
                     <div className="flex items-baseline">
                        <span className="text-6xl font-bold">{totalPoints}</span>
                        <span className="text-3xl font-semibold opacity-80">/4</span>
                    </div>
                </div>
            </div>
            <div className="space-y-4">
                <Accordion title="1. Ventilation for Basements" points={ventilationPoints} maxPoints={1} isOpen={openAccordion === 'ventilation'} onToggle={() => handleAccordionToggle('ventilation')}>
                    <CardShell notes={credit.ventilation.notes}>
                        <div className="space-y-4">
                            <p className="text-sm text-gray-600">Select the type of parking provided:</p>
                            <div className="flex justify-center bg-gray-200 rounded-lg p-1">
                                <button onClick={() => onValueChange('sd', 'sdCr5', 'ventilation.type', 'stilt')} className={`w-1/2 p-2 rounded-md font-semibold transition-colors ${ventilation.type === 'stilt' ? 'bg-white text-green-700 shadow' : 'text-gray-600'}`}>Stilt / Ground Floor</button>
                                <button onClick={() => onValueChange('sd', 'sdCr5', 'ventilation.type', 'basement')} className={`w-1/2 p-2 rounded-md font-semibold transition-colors ${ventilation.type === 'basement' ? 'bg-white text-green-700 shadow' : 'text-gray-600'}`}>Basement</button>
                            </div>
                            {ventilation.type === 'stilt' && (
                                <div className="p-4 bg-green-100 rounded-lg text-center">
                                    <p className="font-semibold text-green-800">Compliance met automatically. (1 Point)</p>
                                </div>
                            )}
                            {ventilation.type === 'basement' && (
                                <StyledCheckbox id="basementCompliance" label="Provide axial fans, CO sensors and meet minimum air changes per hour (ACH) requirements as per NBC 2016 in the basement parking spaces" checked={ventilation.compliance} onChange={() => onValueChange('sd', 'sdCr5', 'ventilation.compliance', !ventilation.compliance)} />
                            )}
                        </div>
                    </CardShell>
                </Accordion>
                <Accordion title="2. Electric Charging Facility" points={evPoints} maxPoints={2} isOpen={openAccordion === 'evCharging'} onToggle={() => handleAccordionToggle('evCharging')}>
                    <CardShell notes={credit.evCharging.notes}>
                       <div className="space-y-8">
                           {/* --- Four Wheelers --- */}
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                               <div className="space-y-4">
                                   <h4 className="font-bold text-gray-800 text-lg">Four Wheelers</h4>
                                   <div className="space-y-2">
                                       <label className="text-sm font-semibold text-gray-600 block">Spaces with EV charging</label>
                                       <input type="number" value={evCharging.catered4W} onChange={e => onValueChange('sd', 'sdCr5', 'evCharging.catered4W', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" />
                                   </div>
                                   <div className="space-y-2">
                                       <label className="text-sm font-semibold text-gray-600 block">Total 4W parking spaces</label>
                                       <input type="number" value={evCharging.total4W} onChange={e => onValueChange('sd', 'sdCr5', 'evCharging.total4W', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" />
                                   </div>
                               </div>
                               <div className="space-y-4">
                                   <DetailedParkingProgress
                                       label="Four Wheeler EV Progress"
                                       provided={parseFloat(evCharging.catered4W) || 0}
                                       total={parseFloat(evCharging.total4W) || 0}
                                       thresholds={[{ percent: 20, label: '1 Pt' }, { percent: 30, label: '2 Pts' }]}
                                       maxPercent={35}
                                   />
                                   <NextPointInsight isComplete={insight4W.isComplete} shortfall={insight4W.shortfall} unit="4W spaces" message="Provide" />
                               </div>
                           </div>
                           <hr/>
                           {/* --- Two Wheelers --- */}
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                               <div className="space-y-4">
                                   <h4 className="font-bold text-gray-800 text-lg">Two Wheelers</h4>
                                   <div className="space-y-2">
                                       <label className="text-sm font-semibold text-gray-600 block">Spaces with EV charging</label>
                                       <input type="number" value={evCharging.catered2W} onChange={e => onValueChange('sd', 'sdCr5', 'evCharging.catered2W', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" />
                                   </div>
                                   <div className="space-y-2">
                                       <label className="text-sm font-semibold text-gray-600 block">Total 2W parking spaces</label>
                                       <input type="number" value={evCharging.total2W} onChange={e => onValueChange('sd', 'sdCr5', 'evCharging.total2W', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" />
                                   </div>
                               </div>
                               <div className="space-y-4">
                                   <DetailedParkingProgress
                                       label="Two Wheeler EV Progress"
                                       provided={parseFloat(evCharging.catered2W) || 0}
                                       total={parseFloat(evCharging.total2W) || 0}
                                       thresholds={[{ percent: 20, label: '1 Pt' }, { percent: 30, label: '2 Pts' }]}
                                       maxPercent={35}
                                   />
                                   <NextPointInsight isComplete={insight2W.isComplete} shortfall={insight2W.shortfall} unit="2W spaces" message="Provide" />
                               </div>
                           </div>
                       </div>
                    </CardShell>
                </Accordion>
                <Accordion title="3. Dedicated Bicycle Parking" points={bicyclePoints} maxPoints={1} isOpen={openAccordion === 'bicycle'} onToggle={() => handleAccordionToggle('bicycle')}>
                    <CardShell>
                        <div className="space-y-6">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-600 block">Dedicated Bicycle Parking Spaces</label>
                                        <input type="number" value={bicycleParking.spaces} onChange={e => onValueChange('sd', 'sdCr5', 'bicycleParking.spaces', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" />
                                    </div>
                                     <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-600 block">Number of Dwelling Units</label>
                                        <input type="number" value={dwellingUnits} disabled className="w-full p-2 border border-gray-300 rounded-md bg-gray-100" />
                                        <p className="text-xs text-gray-500">Value from SD-CR-4 Universal Design</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <DetailedParkingProgress
                                         label="Bicycle Parking Compliance"
                                         provided={parseFloat(bicycleParking.spaces) || 0}
                                         total={dwellingUnits}
                                         thresholds={[{ percent: 5, label: '1 Pt' }]}
                                         maxPercent={7}
                                     />
                                </div>
                            </div>
                            <StyledCheckbox id="bicycleSignage" label="Location of bicycle parking is clearly marked with signages." checked={bicycleParking.signage} onChange={() => onValueChange('sd', 'sdCr5', 'bicycleParking.signage', !bicycleParking.signage)} />
                            <NextPointInsight isComplete={bicyclePoints >= 1} shortfall={bicycleShortfall} unit="more spaces" message="Provide" />
                        </div>
                    </CardShell>
                </Accordion>
            </div>
        </div>
    );
};
const AccessToAmenitiesPage = ({ onBack, values, onValueChange, credit, allValues }) => {
    const [openAccordion, setOpenAccordion] = useState('basicAmenities');
    const { amenities, onSiteFacilities } = values;

    const handleAccordionToggle = (accordion) => {
        setOpenAccordion(openAccordion === accordion ? null : accordion);
    };

    // Part 1: Basic Amenities Calculations
    const selectedAmenitiesCount = useMemo(() => Object.values(amenities).filter(Boolean).length, [amenities]);
    const amenitiesPoint = useMemo(() => (selectedAmenitiesCount >= 6 ? 1 : 0), [selectedAmenitiesCount]);

    // Part 2: On-site Facilities Calculations
    const dwellingUnits = useMemo(() => parseFloat(allValues.sd.sdCr4.dwellingUnits) || 0, [allValues.sd.sdCr4.dwellingUnits]);
    const requiredToilets = useMemo(() => dwellingUnits > 0 ? Math.ceil(dwellingUnits / 250) : 1, [dwellingUnits]);
    const providedToilets = useMemo(() => parseFloat(onSiteFacilities.providedToilets) || 0, [onSiteFacilities.providedToilets]);
    const onSiteFacilitiesPoint = useMemo(() => {
        return onSiteFacilities.playArea && onSiteFacilities.seatingArea && (providedToilets >= requiredToilets) ? 1 : 0;
    }, [onSiteFacilities, providedToilets, requiredToilets]);
    
    const totalPoints = amenitiesPoint + onSiteFacilitiesPoint;

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
            <div className="flex items-center justify-between">
                <button onClick={onBack} className="flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors">
                    <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.79 5.23a.75.75 0 0 1 0 1.06L9.06 10l3.73 3.71a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" /></svg>
                    Back to Credits
                </button>
            </div>
            <div className="bg-green-600 text-white rounded-xl p-6 flex flex-col md:flex-row justify-between items-center shadow-lg">
                <h2 className="text-xl font-bold mb-2 md:mb-0">SD-CR-6: Access to Amenities</h2>
                <div className="text-center">
                     <span className="text-sm font-semibold opacity-80 block">Total Points</span>
                     <div className="flex items-baseline">
                        <span className="text-6xl font-bold">{totalPoints}</span>
                        <span className="text-3xl font-semibold opacity-80">/2</span>
                    </div>
                </div>
            </div>
            <div className="space-y-4">
                <Accordion title="Part 1: Basic Household Amenities (within 1km)" points={amenitiesPoint} maxPoints={1} isOpen={openAccordion === 'basicAmenities'} onToggle={() => handleAccordionToggle('basicAmenities')}>
                    <CardShell>
                        <div className="flex justify-between items-center mb-4 p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm font-semibold text-blue-800">Select at least 6 amenities available to earn 1 point.</p>
                            <div className="text-center">
                                <p className="text-sm text-blue-800">Selected</p>
                                <p className={`text-3xl font-bold ${selectedAmenitiesCount >= 6 ? 'text-green-600' : 'text-blue-900'}`}>{selectedAmenitiesCount} / 6</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {Object.keys(amenities).map(key => (
                                <StyledCheckbox
                                    key={key}
                                    id={`amenity-${key}`}
                                    label={credit.amenitiesList[key]}
                                    checked={amenities[key]}
                                    onChange={() => onValueChange('sd', 'sdCr6', `amenities.${key}`, !amenities[key])}
                                />
                            ))}
                        </div>
                    </CardShell>
                </Accordion>
                <Accordion title="Part 2: On-site Facilities" points={onSiteFacilitiesPoint} maxPoints={1} isOpen={openAccordion === 'onSiteFacilities'} onToggle={() => handleAccordionToggle('onSiteFacilities')}>
                    <CardShell notes={credit.notes}>
                        <p className="text-sm font-semibold text-blue-800 p-3 bg-blue-50 rounded-lg mb-4">Provide all of the following within the campus to earn 1 point.</p>
                        <div className="space-y-6">
                            <StyledCheckbox id="playArea" label="Play area for children with permanently installed tot-lot play equipment." checked={onSiteFacilities.playArea} onChange={() => onValueChange('sd', 'sdCr6', 'onSiteFacilities.playArea', !onSiteFacilities.playArea)} />
                            <StyledCheckbox id="seatingArea" label="Seating area in common spaces." checked={onSiteFacilities.seatingArea} onChange={() => onValueChange('sd', 'sdCr6', 'onSiteFacilities.seatingArea', !onSiteFacilities.seatingArea)} />
                            
                            <div className="p-4 border rounded-lg">
                                <h4 className="font-bold text-gray-700 mb-2">Common Toilet Facilities</h4>
                                <ProgressIndicator 
                                    label="Number of Toilets Provided for Visitors & Service Staff"
                                    provided={providedToilets}
                                    required={requiredToilets}
                                    onValueChange={(e) => onValueChange('sd', 'sdCr6', 'onSiteFacilities.providedToilets', e.target.value)}
                                />
                                 <div className="mt-4">
                                    <label className="text-sm font-semibold text-gray-600 block">Number of Dwelling Units</label>
                                    <input type="number" value={dwellingUnits} disabled className="w-full p-2 mt-1 border border-gray-300 rounded-md bg-gray-100" />
                                    <p className="text-xs text-gray-500 mt-1">Value from SD-CR-4 Universal Design</p>
                                </div>
                            </div>
                        </div>
                    </CardShell>
                </Accordion>
            </div>
        </div>
    );
};
const WorkforceFacilitiesPage = ({ onBack, values, onValueChange, credit }) => {
    const { facilities } = values;
    
    const selectedCount = useMemo(() => Object.values(facilities).filter(Boolean).length, [facilities]);
    const totalPoints = useMemo(() => (selectedCount === Object.keys(facilities).length ? 1 : 0), [selectedCount, facilities]);

    const handleFacilityChange = (key) => {
        onValueChange('sd', 'sdCr7', `facilities.${key}`, !facilities[key]);
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
            <div className="flex items-center justify-between">
                <button onClick={onBack} className="flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors">
                    <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.79 5.23a.75.75 0 0 1 0 1.06L9.06 10l3.73 3.71a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" /></svg>
                    Back to Credits
                </button>
            </div>
            <div className="bg-green-600 text-white rounded-xl p-6 flex flex-col md:flex-row justify-between items-center shadow-lg">
                <h2 className="text-xl font-bold mb-2 md:mb-0">SD-CR-7: Basic Facilities for Construction Workforce</h2>
                <div className="text-center">
                     <span className="text-sm font-semibold opacity-80 block">Total Points</span>
                     <div className="flex items-baseline">
                        <span className="text-6xl font-bold">{totalPoints}</span>
                        <span className="text-3xl font-semibold opacity-80">/1</span>
                    </div>
                </div>
            </div>
            <CardShell>
                <div className="flex justify-between items-center mb-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-semibold text-blue-800">Provide all of the following on-site facilities to earn 1 point.</p>
                    <div className="text-center">
                        <p className="text-sm text-blue-800">Selected</p>
                        <p className={`text-3xl font-bold ${totalPoints === 1 ? 'text-green-600' : 'text-blue-900'}`}>{selectedCount} / {Object.keys(facilities).length}</p>
                    </div>
                </div>
                <div className="space-y-3">
                    {credit.facilityList.map(item => (
                        <StyledCheckbox
                            key={item.id}
                            id={`facility-${item.id}`}
                            label={item.label}
                            checked={facilities[item.id]}
                            onChange={() => handleFacilityChange(item.id)}
                        />
                    ))}
                </div>
            </CardShell>
        </div>
    );
};
const GreenEducationPage = ({ onBack, values, onValueChange, credit }) => {
    const { duringConstruction, postConstruction } = values;

    const duringComplete = useMemo(() => duringConstruction.awareness && duringConstruction.signage, [duringConstruction]);
    const postComplete = useMemo(() => Object.values(postConstruction).every(Boolean), [postConstruction]);
    const totalPoints = useMemo(() => (duringComplete && postComplete) ? 1 : 0, [duringComplete, postComplete]);

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
            <div className="flex items-center justify-between">
                <button onClick={onBack} className="flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors">
                    <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.79 5.23a.75.75 0 0 1 0 1.06L9.06 10l3.73 3.71a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" /></svg>
                    Back to Credits
                </button>
            </div>
            <div className="bg-green-600 text-white rounded-xl p-6 flex flex-col md:flex-row justify-between items-center shadow-lg">
                <h2 className="text-xl font-bold mb-2 md:mb-0">SD-CR-8: Green Education & Awareness</h2>
                <div className="text-center">
                     <span className="text-sm font-semibold opacity-80 block">Total Points</span>
                     <div className="flex items-baseline">
                        <span className="text-6xl font-bold">{totalPoints}</span>
                        <span className="text-3xl font-semibold opacity-80">/1</span>
                    </div>
                </div>
            </div>
            <CardShell>
                 <p className="text-sm font-semibold text-blue-800 p-3 bg-blue-50 rounded-lg mb-6">Fulfill the requirements for both 'During Construction' and 'Post Construction' to earn 1 point.</p>
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-3 border-b-2 pb-2">1. During Construction</h3>
                        <div className="space-y-3 mt-4">
                           <StyledCheckbox id="during-awareness" label="Awareness sessions for construction workforce on green & safety measures." checked={duringConstruction.awareness} onChange={() => onValueChange('sd', 'sdCr8', 'duringConstruction.awareness', !duringConstruction.awareness)} />
                           <StyledCheckbox id="during-signage" label="Display signages indicating envisaged green features." checked={duringConstruction.signage} onChange={() => onValueChange('sd', 'sdCr8', 'duringConstruction.signage', !duringConstruction.signage)} />
                        </div>
                    </div>
                     <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-3 border-b-2 pb-2">2. Post Construction</h3>
                         <p className="text-sm text-gray-600 my-4">Select all measures:</p>
                        <div className="space-y-3">
                           <StyledCheckbox id="post-brochure" label="Project brochure highlighting the green features proposed." checked={postConstruction.brochure} onChange={() => onValueChange('sd', 'sdCr8', 'postConstruction.brochure', !postConstruction.brochure)} />
                           <StyledCheckbox id="post-awareness" label="Awareness sessions to prospective occupants." checked={postConstruction.awareness} onChange={() => onValueChange('sd', 'sdCr8', 'postConstruction.awareness', !postConstruction.awareness)} />
                           <StyledCheckbox id="post-guidelines" label="Circulate green home guidelines." checked={postConstruction.guidelines} onChange={() => onValueChange('sd', 'sdCr8', 'postConstruction.guidelines', !postConstruction.guidelines)} />
                           <StyledCheckbox id="post-signage" label="Permanent signages highlighting the implemented green features." checked={postConstruction.signage} onChange={() => onValueChange('sd', 'sdCr8', 'postConstruction.signage', !postConstruction.signage)} />
                        </div>
                    </div>
                </div>
            </CardShell>
        </div>
    );
};
const SustainableDesignLandingPage = ({ onNavigate, onBack, points }) => {
    const creditsList = [
        { id: 'sd-cr-1', title: 'Natural Topography & Vegetation', maxPoints: 4, points: points.sdCr1, active: true },
        { id: 'sd-cr-2', title: 'Heat Island Effect, Roof & Non-roof', maxPoints: 4, points: points.sdCr2, active: true },
        { id: 'sd-cr-3', title: 'Passive Architecture', maxPoints: 2, points: points.sdCr3, active: true },
        { id: 'sd-cr-4', title: 'Universal Design', maxPoints: 2, points: points.sdCr4, active: true },
        { id: 'sd-cr-5', title: 'Green Parking Facility', maxPoints: 4, points: points.sdCr5, active: true },
        { id: 'sd-cr-6', title: 'Access to Amenities', maxPoints: 2, points: points.sdCr6, active: true },
        { id: 'sd-cr-7', title: 'Basic Facilities for Construction Workforce', maxPoints: 1, points: points.sdCr7, active: true },
        { id: 'sd-cr-8', title: 'Green Education & Awareness', maxPoints: 1, points: points.sdCr8, active: true },
    ];
    
    const totalCategoryPoints = Object.values(points).reduce((acc, p) => acc + p, 0);

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
             <div className="flex items-center justify-between">
                <button onClick={onBack} className="flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors">
                    <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.79 5.23a.75.75 0 0 1 0 1.06L9.06 10l3.73 3.71a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" /></svg>
                    Back to Main Page
                </button>
            </div>
             <div className="bg-green-600 text-white rounded-xl p-6 flex flex-col md:flex-row justify-between items-center shadow-lg mb-4">
                <h2 className="text-xl font-bold mb-2 md:mb-0">Sustainable Design</h2>
                <div className="text-center">
                     <span className="text-sm font-semibold opacity-80 block">Total Category Points</span>
                     <div className="flex items-baseline">
                        <span className="text-6xl font-bold">{totalCategoryPoints}</span>
                        <span className="text-3xl font-semibold opacity-80">/20</span>
                    </div>
                </div>
            </div>
            <div className="space-y-3">
                {creditsList.map(credit => (
                    <button 
                        key={credit.id}
                        onClick={() => credit.active && onNavigate(credit.id)}
                        disabled={!credit.active}
                        className={`w-full p-4 rounded-lg border-2 transition-all duration-200 flex justify-between items-center ${credit.active ? 'border-transparent bg-green-50 hover:bg-green-100 hover:shadow-md cursor-pointer' : 'border-transparent bg-gray-100 text-gray-500 cursor-not-allowed'}`}
                    >
                        <div className="text-left">
                            <p className="font-bold text-green-800">{credit.id.toUpperCase().replace(/-/g, ' ')}</p>
                            <p className={`font-semibold ${credit.active ? 'text-gray-800' : 'text-gray-500'}`}>{credit.title}</p>
                        </div>
                        <div className="flex items-baseline bg-white/60 rounded-lg px-4 py-2">
                            <span className="text-3xl font-extrabold text-green-700">{credit.points}</span>
                            <span className="text-xl font-bold text-green-600 opacity-80">/{credit.maxPoints}</span>
                        </div>
                    </button>
                ))}
             </div>
        </div>
    );
};

// --- Energy Efficiency (EE) Components ---
const EnhancedEnergyPerformancePage = ({ onBack, values, onValueChange, onSourceChange, credits, approach, onApproachChange, totalPoints }) => {
    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
            <div className="flex items-center justify-between">
                <button onClick={onBack} className="flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors">
                    <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.79 5.23a.75.75 0 0 1 0 1.06L9.06 10l3.73 3.71a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" /></svg>
                    Back to Credits
                </button>
            </div>
            <div className="bg-blue-600 text-white rounded-xl p-6 flex flex-col md:flex-row justify-between items-center shadow-lg">
                <h2 className="text-xl font-bold mb-2 md:mb-0">EE-CR-1: Enhanced Energy Performance</h2>
                <div className="text-center">
                     <span className="text-sm font-semibold opacity-80 block">Total Points</span>
                     <div className="flex items-baseline">
                        <span className="text-6xl font-bold">{totalPoints}</span>
                        <span className="text-3xl font-semibold opacity-80">/10</span>
                    </div>
                </div>
            </div>
            <div className="flex justify-center bg-gray-200 rounded-lg p-1">
                <button onClick={() => onApproachChange('prescriptive')} className={`w-1/2 p-2 rounded-md font-semibold transition-colors ${approach === 'prescriptive' ? 'bg-white text-green-700 shadow' : 'text-gray-600'}`}>Prescriptive Approach</button>
                <button onClick={() => onApproachChange('simulation')} className={`w-1/2 p-2 rounded-md font-semibold transition-colors ${approach === 'simulation' ? 'bg-white text-green-700 shadow' : 'text-gray-600'}`}>Simulation Approach</button>
            </div>
            {approach === 'prescriptive' ? (
                <PrescriptiveApproach values={values} onValueChange={onValueChange} onSourceChange={onSourceChange} credits={credits} />
            ) : (
                <SimulationApproach values={values} onValueChange={onValueChange} points={totalPoints} notes={credits.simulation.notes} />
            )}
        </div>
    );
};
const AlternateWaterHeatingPage = ({ onBack, values, onValueChange, onSourceChange, credit }) => {
    const { residents, alternateLitres, technologies, alternateLitresSource } = values;
    
    const totalRequirement = useMemo(() => (parseInt(residents) || 0) * 20, [residents]);
    const percentageMet = useMemo(() => {
        const altL = parseFloat(alternateLitres) || 0;
        return totalRequirement > 0 ? (altL / totalRequirement) * 100 : 0;
    }, [alternateLitres, totalRequirement]);

    const calculatedPoints = useMemo(() => credit.calculationFn(percentageMet, technologies), [percentageMet, technologies, credit]);

    const dynamicThresholds = useMemo(() => {
        return credit.thresholds.map(t => {
            const percentageValue = parseFloat(t.label);
            const requiredLitres = (totalRequirement * percentageValue) / 100;
            return { ...t, label: `${t.label} (${requiredLitres.toFixed(0)} L)` }
        })
    }, [totalRequirement, credit.thresholds]);
    
    const nextPointDelta = useMemo(() => {
        if (calculatedPoints >= 3) return 0;
        const nextThreshold = credit.thresholds.find(t => t.points === calculatedPoints + 1);
        if (!nextThreshold) return 0;
        const nextPercentage = parseFloat(nextThreshold.label);
        const requiredLitres = (totalRequirement * nextPercentage) / 100;
        const currentLitres = parseFloat(alternateLitres) || 0;
        const delta = requiredLitres - currentLitres;
        return delta > 0 ? delta : 0;
    }, [calculatedPoints, credit.thresholds, totalRequirement, alternateLitres]);

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
            <div className="flex items-center justify-between"><button onClick={onBack} className="flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"><svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.79 5.23a.75.75 0 0 1 0 1.06L9.06 10l3.73 3.71a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" /></svg>Back to Credits</button></div>
            <div className="bg-blue-600 text-white rounded-xl p-6 flex flex-col md:flex-row justify-between items-center shadow-lg"><h2 className="text-xl font-bold mb-2 md:mb-0">EE-CR-2: Alternate Water Heating Systems</h2><div className="text-center"><span className="text-sm font-semibold opacity-80 block">Total Points</span><div className="flex items-baseline"><span className="text-6xl font-bold">{calculatedPoints}</span><span className="text-3xl font-semibold opacity-80">/3</span></div></div></div>
            <CardShell notes={credit.notes}>
                <div className="space-y-6">
                    <div className="p-4 border rounded-lg">
                        <h3 className="font-bold text-gray-700 mb-4">Credit Inputs</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                            {/* Left Column */}
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="text-sm font-semibold text-gray-600 block">Hot Water from Alternate Systems (Litres/day)</label>
                                        <SourceToggle source={alternateLitresSource} onSourceChange={(val) => onSourceChange('ee', 'eeCr2', 'alternateLitresSource', val)} />
                                    </div>
                                    <input type="text" value={alternateLitres} disabled={alternateLitresSource === 'sdplus'} onChange={e => onValueChange('ee', 'eeCr2', 'alternateLitres', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100" />
                                </div>
                                <NextPointInsight shortfall={nextPointDelta} unit="Litres/day" isComplete={calculatedPoints >= 3} message="Provide" />
                            </div>
                            {/* Right Column */}
                            <div className="space-y-4">
                                <CreditVisualizer thresholds={dynamicThresholds} calculatedPoints={calculatedPoints} pointsLabel="Target Litres/day" />
                                <div className="p-3 bg-blue-50 rounded-lg text-center">
                                    <p className="text-sm text-blue-800">Percentage Met</p>
                                    <p className="text-3xl font-bold text-blue-900">{percentageMet.toFixed(1)}%</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 border rounded-lg bg-gray-50">
                         <h3 className="font-bold text-gray-700 mb-3">Project Details</h3>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div>
                                <label className="text-sm font-semibold text-gray-600 block mb-1">Number of Residents</label>
                                <input type="text" value={residents} onChange={e => onValueChange('ee', 'eeCr2', 'residents', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
                                <p className="text-sm text-gray-500 mt-1">Total Requirement: <strong className="font-mono">{totalRequirement.toFixed(0)} L/day</strong></p>
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-sm font-semibold text-gray-600 block mb-1">Technology Used</h4>
                                {credit.options.map(opt => (<label key={opt.id} className={`w-full p-2 rounded-lg transition-all duration-200 border-2 flex items-center cursor-pointer ${technologies[opt.id] ? 'bg-green-50 border-green-300' : 'bg-white border-gray-200'}`}><input type="checkbox" checked={!!technologies[opt.id]} onChange={() => onValueChange('ee', 'eeCr2', `technologies.${opt.id}`, !technologies[opt.id])} className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500" /><span className="ml-3 font-semibold text-gray-700 text-sm">{opt.label}</span></label>))}
                            </div>
                         </div>
                    </div>
                </div>
            </CardShell>
        </div>
    );
};
const OnSiteRenewableEnergyPage = ({ onBack, values, onValueChange, onSourceChange, credit }) => {
    const { totalConsumption, renewableGeneration, renewableGenerationSource } = values;
    
    const percentageMet = useMemo(() => {
        const total = parseFloat(totalConsumption) || 0;
        const renewable = parseFloat(renewableGeneration) || 0;
        return total > 0 ? (renewable / total) * 100 : 0;
    }, [totalConsumption, renewableGeneration]);

    const calculatedPoints = useMemo(() => credit.calculationFn(percentageMet), [percentageMet, credit]);

    const dynamicThresholds = useMemo(() => {
        return credit.thresholds.map(t => {
            const percentageValue = parseFloat(t.label);
            const requiredKwh = ((parseFloat(totalConsumption) || 0) * percentageValue) / 100;
            return { ...t, label: `${t.label} (${requiredKwh.toFixed(0)} kWh)` };
        });
    }, [totalConsumption, credit.thresholds]);

    const nextPointDelta = useMemo(() => {
        if (calculatedPoints >= 4) return 0;
        const nextThreshold = credit.thresholds.find(t => t.points === calculatedPoints + 1);
        if (!nextThreshold) return 0;
        const nextPercentage = parseFloat(nextThreshold.label);
        const requiredKwh = ((parseFloat(totalConsumption) || 0) * nextPercentage) / 100;
        const currentKwh = parseFloat(renewableGeneration) || 0;
        const delta = requiredKwh - currentKwh;
        return delta > 0 ? delta : 0;
    }, [calculatedPoints, credit.thresholds, totalConsumption, renewableGeneration]);

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
            <div className="flex items-center justify-between"><button onClick={onBack} className="flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"><svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.79 5.23a.75.75 0 0 1 0 1.06L9.06 10l3.73 3.71a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" /></svg>Back to Credits</button></div>
            <div className="bg-blue-600 text-white rounded-xl p-6 flex flex-col md:flex-row justify-between items-center shadow-lg"><h2 className="text-xl font-bold mb-2 md:mb-0">EE-CR-3: On-site Renewable Energy - Common Lighting</h2><div className="text-center"><span className="text-sm font-semibold opacity-80 block">Total Points</span><div className="flex items-baseline"><span className="text-6xl font-bold">{calculatedPoints}</span><span className="text-3xl font-semibold opacity-80">/4</span></div></div></div>
            <CardShell notes={credit.notes}>
                 <div className="space-y-6">
                    <div className="p-4 border rounded-lg">
                        <h3 className="font-bold text-gray-700 mb-4">Credit Inputs</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                            {/* Left Column */}
                            <div className="space-y-4">
                                <div className="space-y-2">
                                     <div className="flex justify-between items-center mb-1">
                                        <label className="text-sm font-semibold text-gray-600 block">On-site Renewable Energy Generation (kWh/year)</label>
                                        <SourceToggle source={renewableGenerationSource} onSourceChange={(val) => onSourceChange('ee', 'eeCr3', 'renewableGenerationSource', val)} />
                                    </div>
                                    <input type="text" value={renewableGeneration} disabled={renewableGenerationSource === 'sdplus'} onChange={e => onValueChange('ee', 'eeCr3', 'renewableGeneration', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100" />
                                </div>
                                <NextPointInsight shortfall={nextPointDelta} unit="kWh/year" isComplete={calculatedPoints >= 4} message="Provide" />
                            </div>
                            {/* Right Column */}
                            <div className="space-y-4">
                                <CreditVisualizer thresholds={dynamicThresholds} calculatedPoints={calculatedPoints} pointsLabel="Target kWh/year" />
                                <div className="p-3 bg-blue-50 rounded-lg text-center">
                                    <p className="text-sm text-blue-800">Percentage Met</p>
                                    <p className="text-3xl font-bold text-blue-900">{percentageMet.toFixed(1)}%</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 border rounded-lg bg-gray-50">
                        <h3 className="font-bold text-gray-700 mb-3">Project Details</h3>
                        <div>
                            <label className="text-sm font-semibold text-gray-600 block mb-1">Total Annual Common Lighting Consumption (kWh/year)</label>
                            <input type="text" value={totalConsumption} onChange={e => onValueChange('ee', 'eeCr3', 'totalConsumption', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
                        </div>
                    </div>
                </div>
            </CardShell>
        </div>
    );
};
const CommonAreaEquipmentPage = ({ onBack, values, onValueChange, credit }) => {
    const calculatedPoints = useMemo(() => credit.calculationFn(values), [values, credit]);

    const renderSubOptions = (mainSelection, subOptions, name, currentSelection) => (
        <div className={`pl-8 mt-3 space-y-2 transition-all duration-300 ${mainSelection ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
            {subOptions.map(opt => (
                <label key={opt.id} className="flex items-center cursor-pointer">
                    <input 
                        type="checkbox" 
                        checked={!!currentSelection[opt.id]} 
                        onChange={() => {
                            if(name === 'pumpType') onValueChange('ee', 'eeCr4', `pumps.types.${opt.id}`, !currentSelection[opt.id]);
                            if(name === 'motorType') onValueChange('ee', 'eeCr4', `motors.types.${opt.id}`, !currentSelection[opt.id]);
                        }}
                        className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500" 
                    />
                    <span className="ml-3 text-sm text-gray-700">{opt.label}</span>
                </label>
            ))}
        </div>
    );
    
    const renderLiftOptions = (mainSelection, subOptions, name, currentSelection) => (
         <div className={`pl-8 mt-3 space-y-2 transition-all duration-300 ${mainSelection ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
            {subOptions.map(opt => (
                <label key={opt.id} className="flex items-center cursor-pointer"><input type="radio" name={name} value={opt.id} checked={currentSelection === opt.id} onChange={(e) => onValueChange('ee', 'eeCr4', 'lifts.type', e.target.value)} className="h-4 w-4 border-gray-300 text-green-600 focus:ring-green-500" /><span className="ml-3 text-sm text-gray-700">{opt.label}</span></label>
            ))}
        </div>
    );

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
            <div className="flex items-center justify-between"><button onClick={onBack} className="flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"><svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.79 5.23a.75.75 0 0 1 0 1.06L9.06 10l3.73 3.71a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" /></svg>Back to Credits</button></div>
            <div className="bg-blue-600 text-white rounded-xl p-6 flex flex-col md:flex-row justify-between items-center shadow-lg"><h2 className="text-xl font-bold mb-2 md:mb-0">EE-CR-4: Energy Efficiency in Common Area Equipment</h2><div className="text-center"><span className="text-sm font-semibold opacity-80 block">Total Points</span><div className="flex items-baseline"><span className="text-6xl font-bold">{calculatedPoints}</span><span className="text-3xl font-semibold opacity-80">/1</span></div></div></div>
            <CardShell notes={credit.notes}>
                <div className="p-4 border rounded-lg">
                    <h3 className="font-bold text-gray-700 mb-4">Credit Inputs</h3>
                    <p className="text-center text-gray-600 font-semibold bg-gray-100 p-3 rounded-lg">Provide any <strong>two</strong> of the following measures to earn <strong>1 point</strong>.</p>
                    <div className="space-y-4 mt-4">
                        <div className={`p-4 rounded-lg transition-all duration-200 border-2 ${values.pumps.selected ? 'bg-green-100 border-green-400' : 'bg-gray-50 border-transparent'}`}><label className="flex items-center cursor-pointer"><input type="checkbox" checked={values.pumps.selected} onChange={() => onValueChange('ee', 'eeCr4', 'pumps.selected', !values.pumps.selected)} className="h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-green-500" /><span className="ml-4 font-semibold text-gray-700">Pumps</span></label>{renderSubOptions(values.pumps.selected, credit.pumpOptions, 'pumpType', values.pumps.types)}</div>
                        <div className={`p-4 rounded-lg transition-all duration-200 border-2 ${values.motors.selected ? 'bg-green-100 border-green-400' : 'bg-gray-50 border-transparent'}`}><label className="flex items-center cursor-pointer"><input type="checkbox" checked={values.motors.selected} onChange={() => onValueChange('ee', 'eeCr4', 'motors.selected', !values.motors.selected)} className="h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-green-500" /><span className="ml-4 font-semibold text-gray-700">Motors</span></label>{renderSubOptions(values.motors.selected, credit.motorOptions, 'motorType', values.motors.types)}</div>
                        <div className={`p-4 rounded-lg transition-all duration-200 border-2 ${values.lifts.selected ? 'bg-green-100 border-green-400' : 'bg-gray-50 border-transparent'}`}><label className="flex items-center cursor-pointer"><input type="checkbox" checked={values.lifts.selected} onChange={() => onValueChange('ee', 'eeCr4', 'lifts.selected', !values.lifts.selected)} className="h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-green-500" /><span className="ml-4 font-semibold text-gray-700">Efficient Lifts & Escalators</span></label>{renderLiftOptions(values.lifts.selected, credit.liftOptions, 'liftType', values.lifts.type)}</div>
                    </div>
                </div>
            </CardShell>
        </div>
    );
};
const EnergyMonitoringPage = ({ onBack, values, onValueChange, credit }) => {
    const { caseA, caseB, approach } = values;
    const calculatedPoints = useMemo(() => credit.calculationFn(values), [values, credit]);

    const renderChecklist = (options, selection, name) => (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {options.map(opt => (
                <label key={opt.id} className={`p-3 rounded-lg transition-all duration-200 border-2 flex items-center cursor-pointer ${selection[opt.id] ? 'bg-green-100 border-green-400' : 'bg-gray-50 border-transparent'}`}>
                    <input type="checkbox" checked={!!selection[opt.id]} onChange={() => {
                        if (name === 'caseA') onValueChange('ee', 'eeCr5', `caseA.${opt.id}`, !selection[opt.id]);
                        if (name === 'caseB') onValueChange('ee', 'eeCr5', `caseB.${opt.id}`, !selection[opt.id]);
                    }} className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500" />
                    <span className="ml-3 text-sm font-semibold text-gray-700">{opt.label}</span>
                </label>
            ))}
        </div>
    );

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
            <div className="flex items-center justify-between"><button onClick={onBack} className="flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"><svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.79 5.23a.75.75 0 0 1 0 1.06L9.06 10l3.73 3.71a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" /></svg>Back to Credits</button></div>
            <div className="bg-blue-600 text-white rounded-xl p-6 flex flex-col md:flex-row justify-between items-center shadow-lg"><h2 className="text-xl font-bold mb-2 md:mb-0">EE-CR-5: Integrated Energy Monitoring System</h2><div className="text-center"><span className="text-sm font-semibold opacity-80 block">Total Points</span><div className="flex items-baseline"><span className="text-6xl font-bold">{calculatedPoints}</span><span className="text-3xl font-semibold opacity-80">/2</span></div></div></div>
            <CardShell notes={credit.notes}>
                 <div className="p-4 border rounded-lg">
                    <h3 className="font-bold text-gray-700 mb-4">Credit Inputs</h3>
                    <div className="flex justify-center bg-gray-200 rounded-lg p-1 mb-4">
                        <button onClick={() => onValueChange('ee', 'eeCr5', 'approach', 'A')} className={`w-1/2 p-2 rounded-md font-semibold transition-colors ${approach === 'A' ? 'bg-white text-green-700 shadow' : 'text-gray-600'}`}>Case A: Energy Metering</button>
                        <button onClick={() => onValueChange('ee', 'eeCr5', 'approach', 'B')} className={`w-1/2 p-2 rounded-md font-semibold transition-colors ${approach === 'B' ? 'bg-white text-green-700 shadow' : 'text-gray-600'}`}>Case B: Building Management System</button>
                    </div>
                    {approach === 'A' ? (
                        <div>
                            <p className="text-center text-gray-600 font-semibold bg-gray-100 p-3 rounded-lg mb-4">Provide energy meters for <strong>any four</strong> of the following to get <strong>1 point</strong> (max. 2 points).</p>
                            {renderChecklist(credit.caseAOptions, caseA, 'caseA')}
                        </div>
                    ) : (
                        <div>
                            <p className="text-center text-gray-600 font-semibold bg-gray-100 p-3 rounded-lg mb-4">Integrate <strong>any two</strong> measures with BMS to get <strong>1 point</strong> (max. 2 points).</p>
                            {renderChecklist(credit.caseBOptions, caseB, 'caseB')}
                        </div>
                    )}
                </div>
            </CardShell>
        </div>
    );
};
const EnergyEfficiencyLandingPage = ({ onNavigate, onBack, points }) => {
    const creditsList = [
        { id: 'ee-cr-1', title: 'Enhanced Energy Performance', maxPoints: 10, points: points.eeCr1, active: true },
        { id: 'ee-cr-2', title: 'Alternate Water heating Systems', maxPoints: 3, points: points.eeCr2, active: true },
        { id: 'ee-cr-3', title: 'On-site Renewable Energy – Common Lighting', maxPoints: 4, points: points.eeCr3, active: true },
        { id: 'ee-cr-4', title: 'Energy efficiency in common area equipment', maxPoints: 1, points: points.eeCr4, active: true },
        { id: 'ee-cr-5', title: 'Integrated Energy Monitoring System', maxPoints: 2, points: points.eeCr5, active: true },
    ];
    
    const totalCategoryPoints = Object.values(points).reduce((acc, p) => acc + p, 0);

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
             <div className="flex items-center justify-between">
                <button onClick={onBack} className="flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors">
                    <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.79 5.23a.75.75 0 0 1 0 1.06L9.06 10l3.73 3.71a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" /></svg>
                    Back to Main Page
                </button>
            </div>
             <div className="bg-blue-600 text-white rounded-xl p-6 flex flex-col md:flex-row justify-between items-center shadow-lg mb-4">
                <h2 className="text-xl font-bold mb-2 md:mb-0">Energy Efficiency</h2>
                <div className="text-center">
                     <span className="text-sm font-semibold opacity-80 block">Total Category Points</span>
                     <div className="flex items-baseline">
                        <span className="text-6xl font-bold">{totalCategoryPoints}</span>
                        <span className="text-3xl font-semibold opacity-80">/20</span>
                    </div>
                </div>
            </div>
             <div className="space-y-3">
                {creditsList.map(credit => (
                    <button 
                        key={credit.id}
                        onClick={() => credit.active && onNavigate(credit.id)}
                        disabled={!credit.active}
                        className={`w-full p-4 rounded-lg border-2 transition-all duration-200 flex justify-between items-center ${credit.active ? 'border-transparent bg-blue-50 hover:bg-blue-100 hover:shadow-md cursor-pointer' : 'border-transparent bg-gray-100 text-gray-500 cursor-not-allowed'}`}
                    >
                        <div className="text-left">
                            <p className="font-bold text-blue-800">{credit.id.toUpperCase().replace(/-/g, ' ')}</p>
                            <p className={`font-semibold ${credit.active ? 'text-gray-800' : 'text-gray-500'}`}>{credit.title}</p>
                        </div>
                        <div className="flex items-baseline bg-white/60 rounded-lg px-4 py-2">
                            <span className="text-3xl font-extrabold text-blue-700">{credit.points}</span>
                            <span className="text-xl font-bold text-blue-600 opacity-80">/{credit.maxPoints}</span>
                        </div>
                    </button>
                ))}
             </div>
        </div>
    );
};

// --- Main Landing Page ---
const MainLandingPage = ({ onNavigate, sdPoints, eePoints }) => {
    const totalPoints = sdPoints + eePoints;
    const maxPoints = 40; // 20 for SD, 20 for EE

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800">Project Summary</h2>
                <p className="text-gray-500">Overall IGBC Green Homes Progress</p>
            </div>

            <div className="bg-gray-800 text-white rounded-xl p-6 flex flex-col md:flex-row justify-between items-center shadow-lg">
                <h3 className="text-xl font-bold mb-2 md:mb-0">Total Project Points</h3>
                <div className="text-center">
                     <div className="flex items-baseline">
                        <span className="text-6xl font-bold">{totalPoints}</span>
                        <span className="text-3xl font-semibold opacity-80">/{maxPoints}</span>
                    </div>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div 
                    onClick={() => onNavigate('sd-landing')}
                    className="p-6 bg-green-50 border-2 border-green-200 rounded-lg text-center cursor-pointer hover:bg-green-100 hover:shadow-lg transition-all"
                >
                    <h3 className="font-bold text-lg text-green-800">Sustainable Design</h3>
                    <p className="text-5xl font-extrabold text-green-700 my-2">{sdPoints}<span className="text-2xl text-green-600/80">/20</span></p>
                    <span className="text-sm font-semibold text-green-600 bg-green-200 px-3 py-1 rounded-full">View Details</span>
                </div>
                 <div 
                    onClick={() => onNavigate('ee-landing')}
                    className="p-6 bg-blue-50 border-2 border-blue-200 rounded-lg text-center cursor-pointer hover:bg-blue-100 hover:shadow-lg transition-all"
                >
                    <h3 className="font-bold text-lg text-blue-800">Energy Efficiency</h3>
                    <p className="text-5xl font-extrabold text-blue-700 my-2">{eePoints}<span className="text-2xl text-blue-600/80">/20</span></p>
                    <span className="text-sm font-semibold text-blue-600 bg-blue-200 px-3 py-1 rounded-full">View Details</span>
                </div>
            </div>
        </div>
    );
};


// --- Main App Component ---
const App = () => {
    const [currentPage, setCurrentPage] = useState('main-landing');
    
    const sdPlusValues = useMemo(() => ({
        retv: "12.5",
        uValue: "1.0",
        lpd: { interior: '3.5', exterior: '1.5', common: '2.5', parking: '1.5' },
        lightingControls: 'daylight',
        alternateLitres: '200',
        renewableGeneration: '3000'
    }), []);
    
    // Combined state for both categories
    const [values, setValues] = useState({
        sd: {
            sdCr1: { complianceOption: 'A', siteArea: '1000', naturalTopographyArea: '100', vegetationOnGround: '50', vegetationOnBuilt: '0' },
            sdCr2: { nonRoof: { totalArea: '500', treeCover: '100', openGrid: '100', hardscape: '50' }, roof: { totalArea: '800', highSRI: '500', vegetation: '100' } },
            sdCr3: { selectedMeasures: { exteriorOpenings: true, skylights: true, daylighting: false, passiveCooling: false }, exteriorOpenings: { totalWindows: '100', compliantWindows: '75' }, skylights: { skylightArea: '90', roofArea: '1000' }, daylighting: { percentage: '40' }, passiveCooling: { windTower: false, earthTunnel: false, geothermal: false, other: false } },
            sdCr4: { dwellingUnits: '200', partA: { providedParking: '1', providedRestRooms: '1', wheelchairProvision: false }, partB: { uniformFloor: false, wideWalkways: false, brailleLifts: false, stretcherLift: false, visualSignages: false } },
            sdCr5: { ventilation: { type: 'basement', compliance: false }, evCharging: { catered4W: '15', total4W: '100', catered2W: '35', total2W: '100' }, bicycleParking: { spaces: '8', signage: false } },
            sdCr6: { amenities: { bank: true, beautySaloon: false, transport: true, clubhouse: false, education: true, grocery: true, stores: true, laundry: false, medical: true, park: false, worship: false, playground: true, restaurant: false, refueling: false, gym: false, theater: false }, onSiteFacilities: { playArea: false, seatingArea: false, providedToilets: '0' } },
            sdCr7: { facilities: { housing: false, sanitary: false, firstAid: false, drinkingWater: false, ppe: false, dust: false, illumination: false, dayCare: false } },
            sdCr8: { duringConstruction: { awareness: false, signage: false }, postConstruction: { brochure: false, awareness: false, guidelines: false, signage: false } }
        },
        ee: {
            eeCr1: {
                approach: 'prescriptive',
                retv: sdPlusValues.retv, retvSource: 'sdplus', uValue: sdPlusValues.uValue, uValueSource: 'sdplus',
                lpd: sdPlusValues.lpd, lpdSource: 'sdplus',
                ac: '5-star',
                lightingControls: { daylight: true, occupancy: false, timer: false }, lightingControlsSource: 'sdplus',
                spaceHeating: { isApplicable: false, subConditions: { heatPump: false, thermal: false } },
                simulation: { energySavings: '10' },
            },
            eeCr2: { 
                residents: '10', 
                alternateLitres: sdPlusValues.alternateLitres,
                alternateLitresSource: 'sdplus',
                technologies: { solar: true } 
            },
            eeCr3: { 
                totalConsumption: '10000', 
                renewableGeneration: sdPlusValues.renewableGeneration,
                renewableGenerationSource: 'sdplus'
            },
            eeCr4: { pumps: {selected: true, types: {bee4star: true}}, motors: {selected: false, types: {}}, lifts: {selected: true, type: 'regenerative'} },
            eeCr5: { approach: 'A', caseA: { commonLighting: true, exteriorLighting: true, lifts: true, stp: true}, caseB: {} }
        }
    });

    const handleValueChange = (category, credit, keyPath, value) => {
        setValues(prev => {
            const newState = JSON.parse(JSON.stringify(prev)); // Deep copy to avoid mutation issues
    
            let currentLevel = newState[category][credit];
            const keys = keyPath.split('.');
            
            for (let i = 0; i < keys.length - 1; i++) {
                currentLevel = currentLevel[keys[i]];
            }
            
            currentLevel[keys[keys.length - 1]] = value;
            
            return newState;
        });
    };
    
    const handleSourceChange = (category, credit, key, source) => {
        setValues(prev => {
            const newCreditState = { ...prev[category][credit] };
            newCreditState[key] = source;
            
            if (source === 'sdplus') {
                if (key === 'retvSource') newCreditState.retv = sdPlusValues.retv;
                if (key === 'uValueSource') newCreditState.uValue = sdPlusValues.uValue;
                if (key === 'lpdSource') newCreditState.lpd = { ...sdPlusValues.lpd };
                if (key === 'lightingControlsSource') {
                    newCreditState.lightingControls = { daylight: false, occupancy: false, timer: false, [sdPlusValues.lightingControls]: true };
                }
                if (key === 'alternateLitresSource') newCreditState.alternateLitres = sdPlusValues.alternateLitres;
                if (key === 'renewableGenerationSource') newCreditState.renewableGeneration = sdPlusValues.renewableGeneration;
            }

            return {
                ...prev,
                [category]: {
                    ...prev[category],
                    [credit]: newCreditState
                }
            };
        });
    };
    
    // --- All Credit Definitions and Calculation Logic ---
    const credits = useMemo(() => ({
        sd: {
            sdCr1: {
                notes: ["Retaining ‘Natural Topography’ in its broad sense means preserving natural features of the terrain such as natural vegetation, rocks, water body;","The project has to meet the local bye-laws if there is requirement for maintaining minimum vegetation on ground. Credit points shall not be awarded incase the local bye-law requirement is not met.","In Case B, projects with less vegetation on ground, can still meet this credit intent by having 30% vegetation over built-structures which include landscape over roofs, basement, podium and vertical landscaping can be considered.","Grass pavers, potted plants, jogging track, open-air theatre, parking areas, playground, swimming pool, tot-lots, walkways etc., shall not be considered as natural topography credit","The total site area must be consistent across all the credits.","Incase of trees, area of the tree canopy can be considered (estimate over 5 years)"],
                thresholdsA: [ { points: 1, label: '15%' }, { points: 2, label: '25%' } ],
                thresholdsB: [ { points: 3, label: '30%' }, { points: 4, label: '40%' } ],
                calculationFn: (option, percentage) => { if (option === 'A') { if (percentage >= 25) return 2; if (percentage >= 15) return 1; } else if (option === 'B') { if (percentage >= 40) return 4; if (percentage >= 30) return 3; } return 0; }
            },
            sdCr2: {
                nonRoof: { notes: ["The non-roof impervious areas include footpaths, pathways, roads, uncovered surface parking and other impervious areas.","Trees/ Saplings should be planted before occupancy.","Incase of trees, area of the tree canopy can be considered (estimate over 5 years)"], thresholds: [ { points: 1, label: '50%' }, { points: 2, label: '75%' } ], calculationFn: (percentage) => { if (percentage >= 75) return 2; if (percentage >= 50) return 1; return 0; } },
                roof: { notes: ["For this credit, all roof areas, including podium, covered surface parking and utility blocks, which are exposed to the sky (at and above ground level) should be considered for calculations.","Exposed roof area need not include equipment platforms, areas with solar photovoltaic & solar water heaters, skylights, swimming pool, driveways, pathways, roads, play areas etc.,","The other materials which can be used to show compliance include white/ light coloured china mosaic tiles, high reflective coatings and other high reflective materials/ surfaces.","Use ‘Green Pro’ or any other Ecolabel mentioning high SRI values.","The solar reflective index (SRI) is a measure of the constructed surface’s ability to reflect solar heat, as shown by a small temperature rise."], thresholds: [ { points: 1, label: '75%' }, { points: 2, label: '95%' } ], calculationFn: (percentage) => { if (percentage >= 95) return 2; if (percentage >= 75) return 1; return 0; } }
            },
            sdCr3: {
                notes: ["Projection Factor (PF) is the ratio of the horizontal depth of the external shading projection to the vertical height of the fenestration.","Skylights provided on the basement/ podium areas can also be considered for credit calculations.","ECBC-R - Energy Conservation Building Code for Residential Buildings"],
                calculationFn: (v) => { let achievedMeasures = 0; const { selectedMeasures, exteriorOpenings, skylights, daylighting, passiveCooling } = v; if (selectedMeasures.exteriorOpenings) { const totalW = parseFloat(exteriorOpenings.totalWindows) || 0; if (totalW > 0 && (parseFloat(exteriorOpenings.compliantWindows) || 0) / totalW >= 0.8) { achievedMeasures++; } } if (selectedMeasures.skylights) { const roofA = parseFloat(skylights.roofArea) || 0; if (roofA > 0 && (parseFloat(skylights.skylightArea) || 0) / roofA >= 0.1) { achievedMeasures++; } } if (selectedMeasures.daylighting) { if ((parseFloat(daylighting.percentage) || 0) >= 50) { achievedMeasures++; } } if (selectedMeasures.passiveCooling) { if (Object.values(passiveCooling).some(v => v)) { achievedMeasures++; } } return Math.min(achievedMeasures, 2); }
            },
            sdCr4: {
                notes: ["Toilets provided in the common area can be designed to cater both differently abled people and service staff & visitors","Differently abled toilet opening should be minimum 1000mm, door swing opening outside.","Toilets provided in the clubhouse cannot be considered to show credit compliance"],
                options: { partB: [ {id: 'uniformFloor', label: 'Uniformity in floor level for hindrance-free movement'}, {id: 'wideWalkways', label: 'Walkways/ pathways with adequate width in exterior areas'}, {id: 'brailleLifts', label: 'Braille and audio assistance in lifts'}, {id: 'stretcherLift', label: 'Atleast one lift with minimum dimensions to allow a stretcher'}, {id: 'visualSignages', label: 'Visual warning signages in common areas & exterior areas'}, ] },
                calculationFn: (v) => { let points = 0; const { dwellingUnits, partA, partB } = v; const requiredParking = Math.ceil(parseInt(dwellingUnits) / 250) || 0; const requiredRestRooms = Math.ceil(parseInt(dwellingUnits) / 250) || 0; const providedParking = parseInt(partA.providedParking) || 0; const providedRestRooms = parseInt(partA.providedRestRooms) || 0; if (providedParking >= requiredParking && providedRestRooms >= requiredRestRooms && partA.wheelchairProvision) { points += 1; } const partBCount = Object.values(partB).filter(Boolean).length; if (partBCount >= 4) { points += 1; } return points; }
            },
            sdCr5: {
                ventilation: { notes: ["Parking planned in stilt or ground floor would deem to meet the ventilation compliance.", "ACH - Air changes per hour"], calculationFn: (v) => v.type === 'stilt' || v.compliance ? 1 : 0 },
                evCharging: { notes: ["Charging facilities for 20% of the vehicles has been suggested as per the guidelines of Ministry of Housing and Urban Affairs (MoHUA)"], thresholds: [ { points: 1, label: '20%' }, { points: 2, label: '30%' } ], calculationFn: (p) => { if (p >= 30) return 2; if (p >= 20) return 1; return 0; } },
                bicycleParking: { calculationFn: (p, s) => (p >= 5 && s) ? 1 : 0 },
            },
            sdCr6: {
                notes: ["Toilets provided in the common area can be designed to cater both differently abled people and service staff & visitors. For designing differently abled toilets the project must adhere to the local regulations or NBC 2016.","Toilets provided in the clubhouse cannot be considered towards credit compliance calculations.","This point can be earned only if the basic amenities are available before or at the time of project completion.","Basic amenities within the campus can also be considered to show compliance.","All basic house-hold amenities are to be considered only once.","The amenities should be accessible to building/ campus visitors also."],
                amenitiesList: { bank: "Bank/ ATM", beautySaloon: "Beauty Saloon", transport: "Bus/ Metro/ Auto Stand", clubhouse: "Clubhouse", education: "Educational Institutions", grocery: "Grocery/ Super Market", stores: "Stores (various)", laundry: "Laundry Services", medical: "Medical Clinic/ Hospital", park: "Park/ Garden", worship: "Place of Worship", playground: "Playground/ Jogging Track", restaurant: "Restaurant", refueling: "Refueling Station", gym: "Sports club/ Gym", theater: "Theater", },
            },
            sdCr7: {
                facilityList: [ { id: 'housing', label: 'Adequate housing to meet or exceed local/ labour bye-law requirement.' }, { id: 'sanitary', label: 'Sanitary measures to meet or exceed local/ labour bye-law requirement (OR) Provide atleast one toilet seat/ urinal for every 50 workers in any shift, whichever is more stringent.' }, { id: 'firstAid', label: 'First-aid and emergency facilities.' }, { id: 'drinkingWater', label: 'Adequate drinking water facilities.' }, { id: 'ppe', label: 'Personal protective equipment (by owner/ contractor).' }, { id: 'dust', label: 'Dust suppression measures.' }, { id: 'illumination', label: 'Adequate illumination levels in construction work areas.' }, { id: 'dayCare', label: 'Day care/ crèche facility for workers\' children' }, ],
                calculationFn: (v) => Object.values(v.facilities).every(Boolean) ? 1 : 0
            },
            sdCr8: {
                 calculationFn: (v) => (v.duringConstruction.awareness && v.duringConstruction.signage && Object.values(v.postConstruction).every(Boolean)) ? 1 : 0
            }
        },
        ee: {
            eeCr1: {
                buildingEnvelope: { notes: [ "The project should design the building envelope measures as per Eco-Niwas Samhita 2018 (ECBC-R).", "Envelope optimization measures can be referred under National Building Code 2016-Chapter 11, No. 8- Envelope Optimisation." ], retvConfig: { inputLabel: "Project RETV (W/m²)", inputUnit: "W/m²", calculationFn: (v) => { const val=parseFloat(v); if(isNaN(val)) return 0; if(val<=13) return 5; if(val<=13.5) return 4; if(val<=14) return 3; if(val<=14.5) return 2; if(val<=15) return 1; return 0; }, thresholds: [{ points: 1, label: '≤ 15.0' }, { points: 2, label: '≤ 14.5' }, { points: 3, label: '≤ 14.0' }, { points: 4, label: '≤ 13.5' }, { points: 5, label: '≤ 13.0' }] }, uValueConfig: { inputLabel: "Roof U-Value (W/m²K)", inputUnit: "W/m²K", calculationFn: (v) => { const val=parseFloat(v); if(isNaN(val)) return 0; if(val<=1.0) return 2; if(val<=1.2) return 1; return 0; }, thresholds: [{ points: 1, label: '≤ 1.2' }, { points: 2, label: '≤ 1.0' }] } },
                lpd: { notes: [ "Projects should show compliance for all the areas which are in developer’s/ owner’s scope only.", "Compliance for interior, exterior, common and parking area lighting must be shown separately.", "Decorative lighting in respective areas should be considered for lighting power density calculations.", "Exterior areas illuminated by lighting only should be considered for lighting power density calculations." ], baselines: { interior: 5, exterior: 2.5, common: 4, parking: 2.5 }, calculationFn: (vals, baselines) => { const r = Object.keys(baselines).map(a => { const b = baselines[a]; const v = parseFloat(vals[a]); if(isNaN(v) || b === 0) return -1; return ((b - v) / b) * 100; }); if (r.some(v => v < 0)) return 0; if (r.every(v => v >= 30)) return 2; if (r.every(v => v >= 25)) return 1; return 0; }, thresholds: [ { points: 1, label: '≥ 25%' }, { points: 2, label: '≥ 30%' } ] },
                ac: { notes: [ "Applicable for project only if 25% of the total regularly occupied spaces are airconditioned, excluding kitchen & bathroom.", "Projects should show compliance for all the air-conditioning system(s) installed, within the owner’s/ developer’s scope.", "For latest list of air-conditioners rated by BEE, please refer BEE website: <a href='https://www.beestarlabel.com/' target='_blank' rel='noopener noreferrer' class='text-blue-600 hover:underline'>https://www.beestarlabel.com/</a>.", "Minimum Efficiency Requirements for VRF Systems can be referred from ASHRAE Standard 90.1-2016.", "BEE Star rating to be considered as per the latest notifications." ], options: [ { value: 'none', label: 'None / < 4-Star' }, { value: '4-star', label: 'BEE 4-Star Rated' }, { value: '5-star', label: 'BEE 5-Star / Inverter' } ], calculationFn: (val) => { if (val === '5-star') return 2; if (val === '4-star') return 1; return 0; } },
                lightingControls: { notes: [ "All non-emergency exterior & common area lighting such as façade, pathways, landscaping, surface and covered parking, street lighting, staircases should have atleast one of the lighting controls in common areas & common toilets." ], options: [ { id: 'daylight', label: 'Daylight Sensor' }, { id: 'occupancy', label: 'Occupancy/Motion Sensor' }, { id: 'timer', label: 'Timer Based Controls' } ], calculationFn: (selected) => { return Object.values(selected).some(isSelected => isSelected) ? 1 : 0; } },
                spaceHeating: { notes: [ "<strong>Degree day:</strong> The difference in temperature between the outdoor mean temperature over 24 hour period and a given base temperature.", "<strong>Heating degree day base 18°C, HDD 18:</strong> for any one day, when the mean temperature is less than 18°C, there are as many degree-days as degree Centigrade temperature difference between the mean temperature for the day and 18°C. Annual heating degree-days (HDDs) are the sum of the degree-days over the calendar year." ], applicability: { label: 'Applicable (HDD 18 > 150)' }, conditions: [ { id: 'heatPump', label: 'Unitary heat pumps meet ECBC-R / ECBC 2017 criteria' }, { id: 'thermal', label: 'Non-electricity heating has ≥ 70% thermal efficiency' } ], calculationFn: (isApplicable, subConditions) => { if (!isApplicable) return 0; const allMet = Object.values(subConditions).every(val => val === true); return allMet ? 1 : 0; } },
                simulation: { notes: [ "Projects having multiple building types must independently meet the minimum energy performance criteria to be eligible for Enhanced Energy Performance.", "Trade-offs among different building parameters (such as lighting, air-conditioning, etc.) are permissible.", "Projects which use on-site renewable energy sources (such as solar photovoltaics, wind turbines, etc.) can subtract the renewable energy generated from the total energy of the proposed case.", "Alternate hot water heating systems (Solar Hot water, LPG, Heat Pumps) should not be modeled in either the base case or the proposed case, to show energy savings." ] }
            },
            eeCr2: {
                notes: [ "The minimum hot water requirement for domestic purposes should be considered as 20 liters per person per day.", "The minimum temperature requirement of hot water to be considered for domestic applications can range between 35-40 deg C." ],
                options: [ { id: 'gas', label: 'Natural Gas (or) LPG based systems' }, { id: 'heatPump', label: 'Heat pump with minimum of COP 3.2' }, { id: 'solar', label: 'Solar water heating systems' } ],
                thresholds: [ { points: 1, label: '50%' }, { points: 2, label: '75%' }, { points: 3, label: '95%' } ],
                calculationFn: (percentage, technologies) => {
                    const techSelected = Object.values(technologies).some(t => t);
                    if (!techSelected) return 0;
                    if (percentage >= 95) return 3;
                    if (percentage >= 75) return 2;
                    if (percentage >= 50) return 1;
                    return 0;
                }
            },
            eeCr3: {
                notes: [ "Solar hot water systems cannot be considered as power generation source and cannot be subtracted from the total energy of the proposed case.", "Common area lighting requirements include lighting used in corridors, basements, parking, club house, landscaping and any other common areas under developer scope." ],
                thresholds: [ { points: 1, label: '25%' }, { points: 2, label: '50%' }, { points: 3, label: '75%' }, { points: 4, label: '95%' } ],
                calculationFn: (percentage) => {
                    if (percentage >= 95) return 4;
                    if (percentage >= 75) return 3;
                    if (percentage >= 50) return 2;
                    if (percentage >= 25) return 1;
                    return 0;
                }
            },
            eeCr4: {
                notes: [],
                pumpOptions: [ {id: 'bee4star', label: 'BEE 4-star rated'}, {id: 'eff70', label: 'Min. 70% efficiency (>3 HP)'}, {id: 'isi', label: 'ISI certified (others)'} ],
                motorOptions: [ {id: 'bee4star', label: 'BEE 4-star rated'}, {id: 'eff85', label: 'Min. 85% efficiency (>3 HP)'}, {id: 'isi', label: 'ISI certified (others)'} ],
                liftOptions: [ {id: 'regenerative', label: 'Regenerative lifts'}, {id: 'doubleDeck', label: 'Double-deck elevators'}, {id: 'gearless', label: 'Gearless traction elevators'}, {id: 'machineRoomless', label: 'Machine-room less traction elevators'} ],
                calculationFn: (v) => {
                    const pumpsMet = v.pumps.selected && Object.values(v.pumps.types).some(Boolean);
                    const motorsMet = v.motors.selected && Object.values(v.motors.types).some(Boolean);
                    const liftsMet = v.lifts.selected && v.lifts.type;
                    const measuresMet = [pumpsMet, motorsMet, liftsMet].filter(Boolean).length;
                    return measuresMet >= 2 ? 1 : 0;
                }
            },
            eeCr5: {
                notes: [],
                caseAOptions: [ {id: 'commonLighting', label: 'Common area lighting'}, {id: 'exteriorLighting', label: 'Exterior area lighting'}, {id: 'lifts', label: 'Energy meter for lifts'}, {id: 'stp', label: 'STP'}, {id: 'pumpsMotors', label: 'Pumps & motors'}, {id: 'clubHouse', label: 'Club house'}, {id: 'dgSet', label: 'DG set'}, {id: 'reGeneration', label: 'RE generation'}, {id: 'airConditioning', label: 'Air-conditioning'}, {id: 'treatedWater', label: 'Treated waste water pumping'}, {id: 'powerBackup', label: 'Power backup systems'}, {id: 'other', label: 'Any other energy consuming equipment'} ],
                caseBOptions: [ {id: 'acManagement', label: 'Air-conditioning management system'}, {id: 'lightingManagement', label: 'Lighting management system'}, {id: 'elevatorManagement', label: 'Elevator management system'}, {id: 'reManagement', label: 'Renewable energy management system'}, {id: 'cctv', label: 'CCTV'}, {id: 'waterLevel', label: 'Overhead water level indicators'}, {id: 'waterMetering', label: 'Water Metering (dwelling unit level)'} ],
                calculationFn: (v) => {
                    if (v.approach === 'A') {
                        const count = Object.values(v.caseA).filter(Boolean).length;
                        return Math.min(Math.floor(count / 4), 2);
                    } else {
                        const count = Object.values(v.caseB).filter(Boolean).length;
                        return Math.min(Math.floor(count / 2), 2);
                    }
                }
            }
        }
    }), []);

    // --- Points Calculation ---
    const sdPoints = useMemo(() => {
        const v = values.sd;
        const c = credits.sd;
        let total = 0;
        
        const p1 = ((parseFloat(v.sdCr1.naturalTopographyArea) || 0) + (parseFloat(v.sdCr1.vegetationOnGround) || 0) + (v.sdCr1.complianceOption === 'B' ? (parseFloat(v.sdCr1.vegetationOnBuilt) || 0) : 0)) / (parseFloat(v.sdCr1.siteArea) || 1) * 100;
        total += c.sdCr1.calculationFn(v.sdCr1.complianceOption, p1);

        const p2_nonRoof = ((parseFloat(v.sdCr2.nonRoof.treeCover) || 0) + (parseFloat(v.sdCr2.nonRoof.openGrid) || 0) + (parseFloat(v.sdCr2.nonRoof.hardscape) || 0)) / (parseFloat(v.sdCr2.nonRoof.totalArea) || 1) * 100;
        const p2_roof = ((parseFloat(v.sdCr2.roof.highSRI) || 0) + (parseFloat(v.sdCr2.roof.vegetation) || 0)) / (parseFloat(v.sdCr2.roof.totalArea) || 1) * 100;
        total += c.sdCr2.nonRoof.calculationFn(p2_nonRoof) + c.sdCr2.roof.calculationFn(p2_roof);

        total += c.sdCr3.calculationFn(v.sdCr3);
        total += c.sdCr4.calculationFn(v.sdCr4);
        
        const p5_ev = Math.min(((parseFloat(v.sdCr5.evCharging.catered4W) || 0) / (parseFloat(v.sdCr5.evCharging.total4W) || 1) * 100), ((parseFloat(v.sdCr5.evCharging.catered2W) || 0) / (parseFloat(v.sdCr5.evCharging.total2W) || 1) * 100));
        const p5_bicycle = (parseFloat(v.sdCr4.dwellingUnits) || 0) > 0 ? ((parseFloat(v.sdCr5.bicycleParking.spaces) || 0) / (parseFloat(v.sdCr4.dwellingUnits) || 1)) * 100 : 0;
        total += c.sdCr5.ventilation.calculationFn(v.sdCr5.ventilation) + c.sdCr5.evCharging.calculationFn(p5_ev) + c.sdCr5.bicycleParking.calculationFn(p5_bicycle, v.sdCr5.bicycleParking.signage);
        
        const p6_amenities = Object.values(v.sdCr6.amenities).filter(Boolean).length >= 6 ? 1 : 0;
        const p6_toilets_req = Math.ceil((parseFloat(v.sdCr4.dwellingUnits) || 0) / 250) || 1;
        const p6_facilities = v.sdCr6.onSiteFacilities.playArea && v.sdCr6.onSiteFacilities.seatingArea && ((parseFloat(v.sdCr6.onSiteFacilities.providedToilets) || 0) >= p6_toilets_req) ? 1 : 0;
        total += p6_amenities + p6_facilities;

        total += c.sdCr7.calculationFn(v.sdCr7);
        total += c.sdCr8.calculationFn(v.sdCr8);

        return total;
    }, [values.sd, credits.sd]);

    const eeCr1Points = useMemo(() => {
        const v = values.ee.eeCr1;
        const c = credits.ee.eeCr1;
        let points = 0;
        if (v.approach === 'prescriptive') {
            points += c.buildingEnvelope.retvConfig.calculationFn(v.retv);
            points += c.buildingEnvelope.uValueConfig.calculationFn(v.uValue);
            points += c.lpd.calculationFn(v.lpd, c.lpd.baselines);
            points += c.ac.calculationFn(v.ac);
            points += c.lightingControls.calculationFn(v.lightingControls);
            points += c.spaceHeating.calculationFn(v.spaceHeating.isApplicable, v.spaceHeating.subConditions);
        } else {
            const savings = parseFloat(v.simulation.energySavings) || 0;
            if (savings >= 25) points = 10; else if (savings >= 22.5) points = 9; else if (savings >= 20) points = 8; else if (savings >= 17.5) points = 7; else if (savings >= 15) points = 6; else if (savings >= 12.5) points = 5; else if (savings >= 10) points = 4; else if (savings >= 7.5) points = 3; else if (savings >= 5) points = 2; else if (savings >= 2.5) points = 1;
        }
        return Math.min(points, 10);
    }, [values.ee.eeCr1, credits.ee.eeCr1]);

    const eePoints = useMemo(() => {
        const v = values.ee;
        const c = credits.ee;
        let total = 0;
        total += eeCr1Points;
        
        const p2_req = (parseInt(v.eeCr2.residents) || 0) * 20;
        const p2_met = p2_req > 0 ? ((parseFloat(v.eeCr2.alternateLitres) || 0) / p2_req) * 100 : 0;
        total += c.eeCr2.calculationFn(p2_met, v.eeCr2.technologies);

        const p3_met = (parseFloat(v.eeCr3.totalConsumption) || 0) > 0 ? ((parseFloat(v.eeCr3.renewableGeneration) || 0) / (parseFloat(v.eeCr3.totalConsumption) || 1)) * 100 : 0;
        total += c.eeCr3.calculationFn(p3_met);

        total += c.eeCr4.calculationFn(v.eeCr4);
        total += c.eeCr5.calculationFn(v.eeCr5);
        
        return total;
    }, [values.ee, credits.ee, eeCr1Points]);


    const renderPage = () => {
        // This router handles navigation for the entire application
        switch (currentPage) {
            // Main Navigation
            case 'main-landing':
                return <MainLandingPage onNavigate={setCurrentPage} sdPoints={sdPoints} eePoints={eePoints} />;
            case 'sd-landing':
                return <SustainableDesignLandingPage onNavigate={setCurrentPage} onBack={() => setCurrentPage('main-landing')} points={{ sdCr1: credits.sd.sdCr1.calculationFn(values.sd.sdCr1.complianceOption, ((parseFloat(values.sd.sdCr1.naturalTopographyArea) || 0) + (parseFloat(values.sd.sdCr1.vegetationOnGround) || 0) + (values.sd.sdCr1.complianceOption === 'B' ? (parseFloat(values.sd.sdCr1.vegetationOnBuilt) || 0) : 0)) / (parseFloat(values.sd.sdCr1.siteArea) || 1) * 100), sdCr2: credits.sd.sdCr2.nonRoof.calculationFn(((parseFloat(values.sd.sdCr2.nonRoof.treeCover) || 0) + (parseFloat(values.sd.sdCr2.nonRoof.openGrid) || 0) + (parseFloat(values.sd.sdCr2.nonRoof.hardscape) || 0)) / (parseFloat(values.sd.sdCr2.nonRoof.totalArea) || 1) * 100) + credits.sd.sdCr2.roof.calculationFn(((parseFloat(values.sd.sdCr2.roof.highSRI) || 0) + (parseFloat(values.sd.sdCr2.roof.vegetation) || 0)) / (parseFloat(values.sd.sdCr2.roof.totalArea) || 1) * 100), sdCr3: credits.sd.sdCr3.calculationFn(values.sd.sdCr3), sdCr4: credits.sd.sdCr4.calculationFn(values.sd.sdCr4), sdCr5: credits.sd.sdCr5.ventilation.calculationFn(values.sd.sdCr5.ventilation) + credits.sd.sdCr5.evCharging.calculationFn(Math.min(((parseFloat(values.sd.sdCr5.evCharging.catered4W) || 0) / (parseFloat(values.sd.sdCr5.evCharging.total4W) || 1) * 100), ((parseFloat(values.sd.sdCr5.evCharging.catered2W) || 0) / (parseFloat(values.sd.sdCr5.evCharging.total2W) || 1) * 100))) + credits.sd.sdCr5.bicycleParking.calculationFn(((parseFloat(values.sd.sdCr4.dwellingUnits) || 0) > 0 ? ((parseFloat(values.sd.sdCr5.bicycleParking.spaces) || 0) / (parseFloat(values.sd.sdCr4.dwellingUnits) || 1)) * 100 : 0), values.sd.sdCr5.bicycleParking.signage), sdCr6: (Object.values(values.sd.sdCr6.amenities).filter(Boolean).length >= 6 ? 1 : 0) + (values.sd.sdCr6.onSiteFacilities.playArea && values.sd.sdCr6.onSiteFacilities.seatingArea && ((parseFloat(values.sd.sdCr6.onSiteFacilities.providedToilets) || 0) >= (Math.ceil((parseFloat(values.sd.sdCr4.dwellingUnits) || 0) / 250) || 1)) ? 1 : 0), sdCr7: credits.sd.sdCr7.calculationFn(values.sd.sdCr7), sdCr8: credits.sd.sdCr8.calculationFn(values.sd.sdCr8) }} />;
            case 'ee-landing':
                 return <EnergyEfficiencyLandingPage onNavigate={setCurrentPage} onBack={() => setCurrentPage('main-landing')} points={{ eeCr1: eeCr1Points, eeCr2: credits.ee.eeCr2.calculationFn(((parseInt(values.ee.eeCr2.residents) || 0) * 20 > 0 ? ((parseFloat(values.ee.eeCr2.alternateLitres) || 0) / ((parseInt(values.ee.eeCr2.residents) || 0) * 20)) * 100 : 0), values.ee.eeCr2.technologies), eeCr3: credits.ee.eeCr3.calculationFn(((parseFloat(values.ee.eeCr3.totalConsumption) || 0) > 0 ? ((parseFloat(values.ee.eeCr3.renewableGeneration) || 0) / (parseFloat(values.ee.eeCr3.totalConsumption) || 1)) * 100 : 0)), eeCr4: credits.ee.eeCr4.calculationFn(values.ee.eeCr4), eeCr5: credits.ee.eeCr5.calculationFn(values.ee.eeCr5) }} />;
            
            // SD Credit Pages
            case 'sd-cr-1': return <NaturalTopographyPage onBack={() => setCurrentPage('sd-landing')} values={values.sd.sdCr1} onValueChange={handleValueChange} credit={credits.sd.sdCr1} />;
            case 'sd-cr-2': return <HeatIslandEffectPage onBack={() => setCurrentPage('sd-landing')} values={values.sd.sdCr2} onValueChange={handleValueChange} credit={credits.sd.sdCr2} />;
            case 'sd-cr-3': return <PassiveArchitecturePage onBack={() => setCurrentPage('sd-landing')} values={values.sd.sdCr3} onValueChange={handleValueChange} credit={credits.sd.sdCr3} />;
            case 'sd-cr-4': return <UniversalDesignPage onBack={() => setCurrentPage('sd-landing')} values={values.sd.sdCr4} onValueChange={handleValueChange} credit={credits.sd.sdCr4} />;
            case 'sd-cr-5': return <GreenParkingFacilityPage onBack={() => setCurrentPage('sd-landing')} values={values.sd.sdCr5} onValueChange={handleValueChange} credit={credits.sd.sdCr5} allValues={values} />;
            case 'sd-cr-6': return <AccessToAmenitiesPage onBack={() => setCurrentPage('sd-landing')} values={values.sd.sdCr6} onValueChange={handleValueChange} credit={credits.sd.sdCr6} allValues={values} />;
            case 'sd-cr-7': return <WorkforceFacilitiesPage onBack={() => setCurrentPage('sd-landing')} values={values.sd.sdCr7} onValueChange={handleValueChange} credit={credits.sd.sdCr7} />;
            case 'sd-cr-8': return <GreenEducationPage onBack={() => setCurrentPage('sd-landing')} values={values.sd.sdCr8} onValueChange={handleValueChange} credit={credits.sd.sdCr8} />;
            
            // EE Credit Pages
            case 'ee-cr-1': return <EnhancedEnergyPerformancePage onBack={() => setCurrentPage('ee-landing')} values={values.ee.eeCr1} onValueChange={handleValueChange} onSourceChange={handleSourceChange} credits={credits.ee.eeCr1} approach={values.ee.eeCr1.approach} onApproachChange={(appr) => handleValueChange('ee', 'eeCr1', 'approach', appr)} totalPoints={eeCr1Points} />;
            case 'ee-cr-2': return <AlternateWaterHeatingPage onBack={() => setCurrentPage('ee-landing')} values={values.ee.eeCr2} onValueChange={handleValueChange} onSourceChange={handleSourceChange} credit={credits.ee.eeCr2} />;
            case 'ee-cr-3': return <OnSiteRenewableEnergyPage onBack={() => setCurrentPage('ee-landing')} values={values.ee.eeCr3} onValueChange={handleValueChange} onSourceChange={handleSourceChange} credit={credits.ee.eeCr3} />;
            case 'ee-cr-4': return <CommonAreaEquipmentPage onBack={() => setCurrentPage('ee-landing')} values={values.ee.eeCr4} onValueChange={handleValueChange} credit={credits.ee.eeCr4} />;
            case 'ee-cr-5': return <EnergyMonitoringPage onBack={() => setCurrentPage('ee-landing')} values={values.ee.eeCr5} onValueChange={handleValueChange} credit={credits.ee.eeCr5} />;

            default:
                return <MainLandingPage onNavigate={setCurrentPage} sdPoints={sdPoints} eePoints={eePoints} />;
        }
    };

    return (
        <div className="bg-slate-100 min-h-screen font-sans p-4">
            <div className="w-full max-w-5xl mx-auto">
                <div className="mb-6 text-center">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">IGBC Green Homes</h1>
                    <p className="text-gray-500 mt-1">Credit Compliance Calculator</p>
                </div>
                {renderPage()}
                <p className="text-center text-xs text-gray-400 mt-8">This is an interactive tool for estimation purposes. Please refer to official IGBC guidelines for final certification.</p>
            </div>
        </div>
    );
};

export default App;
