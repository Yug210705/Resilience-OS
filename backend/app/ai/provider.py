from abc import ABC, abstractmethod
from .contracts import AIRequestPayload, AIResponsePayload

class AIProvider(ABC):
    """
    Stable internal interface for AI recommendations.
    Member 4 will implement a concrete version of this provider.
    """
    
    @abstractmethod
    def evaluate_recovery(self, request: AIRequestPayload) -> AIResponsePayload:
        """
        Evaluate and rank feasible recovery options using an AI model.
        
        Args:
            request (AIRequestPayload): The context and feasible options.
            
        Returns:
            AIResponsePayload: Ranked recommendations with reasoning.
            
        Raises:
            AIProviderUnavailableError: If the provider is disabled or unreachable.
            AIResponseInvalidError: If the provider's output breaks the contract.
            AIProviderTimeoutError: If the request times out.
        """
        pass
