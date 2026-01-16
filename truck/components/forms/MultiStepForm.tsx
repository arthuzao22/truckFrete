"use client"

import { ReactNode, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Check } from "lucide-react"
import { Button } from "@/components/ui/Button"

export interface Step {
  id: string
  title: string
  description?: string
  component: ReactNode
  validate?: () => Promise<boolean> | boolean
}

interface MultiStepFormProps {
  steps: Step[]
  onComplete: () => void | Promise<void>
  onCancel?: () => void
  className?: string
}

export function MultiStepForm({ steps, onComplete, onCancel, className = "" }: MultiStepFormProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === steps.length - 1
  const currentStepData = steps[currentStep]

  const handleNext = async () => {
    setError(null)

    // Validar step atual se houver validação
    if (currentStepData.validate) {
      setLoading(true)
      try {
        const isValid = await currentStepData.validate()
        if (!isValid) {
          setLoading(false)
          return
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro na validação")
        setLoading(false)
        return
      }
      setLoading(false)
    }

    // Marcar step como completo
    setCompletedSteps((prev) => new Set([...prev, currentStep]))

    // Se é o último step, finalizar
    if (isLastStep) {
      setLoading(true)
      try {
        await onComplete()
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao finalizar")
      } finally {
        setLoading(false)
      }
      return
    }

    // Ir para próximo step
    setCurrentStep((prev) => prev + 1)
  }

  const handleBack = () => {
    setError(null)
    setCurrentStep((prev) => prev - 1)
  }

  const handleStepClick = (index: number) => {
    // Só permite clicar em steps já completados ou o próximo
    if (index <= currentStep || completedSteps.has(index - 1)) {
      setCurrentStep(index)
      setError(null)
    }
  }

  const progress = ((currentStep + 1) / steps.length) * 100

  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => {
            const isActive = index === currentStep
            const isCompleted = completedSteps.has(index)
            const isAccessible = index <= currentStep || completedSteps.has(index - 1)

            return (
              <div key={step.id} className="flex items-center flex-1">
                {/* Step Circle */}
                <button
                  onClick={() => handleStepClick(index)}
                  disabled={!isAccessible}
                  className={`
                    relative z-10 flex items-center justify-center w-10 h-10 rounded-full font-semibold
                    transition-all duration-300
                    ${isActive ? "bg-blue-600 text-white scale-110 shadow-lg" : ""}
                    ${isCompleted && !isActive ? "bg-green-500 text-white" : ""}
                    ${!isActive && !isCompleted ? "bg-gray-200 text-gray-500" : ""}
                    ${isAccessible && !isActive ? "hover:bg-gray-300 cursor-pointer" : ""}
                    ${!isAccessible ? "cursor-not-allowed" : ""}
                  `}
                >
                  {isCompleted ? <Check className="w-5 h-5" /> : index + 1}
                </button>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="flex-1 h-1 mx-2 bg-gray-200">
                    <motion.div
                      className="h-full bg-blue-600"
                      initial={{ width: "0%" }}
                      animate={{
                        width: completedSteps.has(index) ? "100%" : "0%",
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Step Titles */}
        <div className="flex items-start justify-between">
          {steps.map((step, index) => {
            const isActive = index === currentStep
            return (
              <div
                key={`title-${step.id}`}
                className={`flex-1 text-center ${index < steps.length - 1 ? "pr-4" : ""}`}
              >
                <p
                  className={`text-sm font-medium transition-colors ${
                    isActive ? "text-blue-600" : "text-gray-500"
                  }`}
                >
                  {step.title}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg"
        >
          {error}
        </motion.div>
      )}

      {/* Step Content */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 mb-6">
        {/* Step Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {currentStepData.title}
          </h2>
          {currentStepData.description && (
            <p className="text-gray-600">{currentStepData.description}</p>
          )}
        </div>

        {/* Step Component */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentStepData.component}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <div>
          {!isFirstStep && (
            <Button
              type="button"
              variant="secondary"
              onClick={handleBack}
              disabled={loading}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          )}
        </div>

        <div className="flex gap-3">
          {onCancel && (
            <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
              Cancelar
            </Button>
          )}

          <Button
            type="button"
            variant="primary"
            onClick={handleNext}
            disabled={loading}
            className="min-w-[150px]"
          >
            {loading ? (
              "Processando..."
            ) : isLastStep ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Finalizar
              </>
            ) : (
              <>
                Próximo
                <ChevronRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
