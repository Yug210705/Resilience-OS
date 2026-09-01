from typing import Optional, List, Dict, Any
from .contracts import AIRequestPayload, AIResponsePayload, EvaluatedOption, DisruptionInfo, ImpactInfo
from .provider import AIProvider
from .exceptions import AIProviderUnavailableError, AIResponseInvalidError, AIHallucinationError
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

class AIAdapter:
    """
    Integration boundary for AI services.
    Manages constructing the contract, invoking the provider, and validating the response.
    """
    
    def __init__(self, provider: Optional[AIProvider] = None):
        # Allow injection, else rely on configuration
        self.provider = provider
        
    def get_recommendations(self, request: AIRequestPayload) -> AIResponsePayload:
        if not settings.AI_PROVIDER_ENABLED or self.provider is None:
            logger.warning("AI integration is not configured or provider is missing.")
            raise AIProviderUnavailableError("AI integration is not configured.")
            
        try:
            # Pass deterministic data boundary to AI
            response = self.provider.evaluate_recovery(request)
        except AIProviderUnavailableError:
            raise
        except Exception as e:
            logger.error(f"Unexpected error from AI Provider: {e}")
            raise AIProviderUnavailableError(f"Unexpected AI failure: {e}")
            
        self._validate_no_hallucinations(request.evaluated_options, response)
        
        return response
        
    def _validate_no_hallucinations(self, feasible_options: List[EvaluatedOption], response: AIResponsePayload):
        """
        Critical security validation: Ensure the AI does not recommend actions
        that were not pre-calculated as feasible by the deterministic Recovery Engine.
        """
        # Create a set of (action_type, stringified_details) for comparison
        feasible_set = set()
        for opt in feasible_options:
            # Basic matching (could be improved with a stable hash or IDs if available)
            feasible_set.add((opt.action_type, str(sorted(opt.details.items()))))
            
        for rec in response.recommendations:
            rec_key = (rec.action_type, str(sorted(rec.details.items())))
            if rec_key not in feasible_set:
                logger.error(f"AI hallucinated unfeasible action: {rec.action_type} - {rec.details}")
                raise AIHallucinationError("AI recommended an action not present in the feasible options.")
